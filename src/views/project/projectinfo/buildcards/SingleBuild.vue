<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:siglebuild:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:siglebuild:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:siglebuild:remove']"
        >删除
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['project:siglebuild:export']"
              >导出</el-button>
            </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="siglebuildList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="使用性质" align="center" prop="useNatureDictLabel"/>
      <el-table-column label="建筑名称" align="center" prop="buildName"/>
      <el-table-column label="耐火等级" align="center" prop="refractoryLevel" :formatter="refractoryLevelFormat"/>
      <el-table-column label="结构类型" align="center" prop="structureType" :formatter="structureTypeFormat"/>
      <el-table-column label="地上层数(层)" align="center" prop="upperNumber"/>
      <el-table-column label="地下层数(层)" align="center" prop="underNumber"/>
      <el-table-column label="建筑高度(米)" align="center" prop="buildHeight"/>
      <el-table-column label="建筑长度(米)" align="center" prop="buildLength"/>
      <el-table-column label="建筑面积(平方米)" align="center" prop="coversArea"/>
      <el-table-column label="地上建筑面积(平方米)" align="center" prop="floorArea"/>
      <el-table-column label="地下建筑面积(平方米)" align="center" prop="underFloorArea"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['project:siglebuild:edit']"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['project:siglebuild:remove']"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改单体建筑对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="建筑名称" prop="buildName">
              <el-input v-model="form.buildName" placeholder="请输入建筑名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用性质" prop="useNature">
              <treeselect :defaultExpandLevel="Infinity" :disable-branch-nodes="true" v-model="form.useNature"
                          :options="categoryOptions" :normalizer="normalizer" placeholder="请选择"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结构类型" prop="structureType">
              <el-select v-model="form.structureType" placeholder="请选择耐火等级">
                <el-option
                  v-for="dict in structureTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耐火等级" prop="refractoryLevel">
              <el-select v-model="form.refractoryLevel" placeholder="请选择耐火等级">
                <el-option
                  v-for="dict in refractoryLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地上层数" prop="upperNumber">
              <el-input v-model="form.upperNumber" placeholder="请输入地上层数">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地下层数" prop="underNumber">
              <el-input v-model="form.underNumber" placeholder="请输入地下层数">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑高度" prop="buildHeight">
              <el-input v-model="form.buildHeight" placeholder="请输入建筑高度">
                <template slot="append">m</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑长度" prop="buildLength">
              <el-input v-model="form.buildLength" placeholder="请输入建筑长度">
                <template slot="append">m</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="占地面积" prop="coversArea">
              <el-input v-model="form.coversArea" placeholder="请输入建筑面积">
                <template slot="append">m<sup>2</sup></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地上建筑面积" prop="FloorArea">
              <el-input v-model="form.floorArea" placeholder="请输入地上建筑面积">
                <template slot="append">m<sup>2</sup></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地下建筑面积" prop="underFloorArea">
              <el-input v-model="form.underFloorArea" placeholder="请输入地下建筑面积">
                <template slot="append">m<sup>2</sup></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="formLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HlUsing from '@/components/HlUsing';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getTree, getEquipment} from "@/api/project/equipment";
import { listConstruct, getConstruct, delConstruct, addConstruct, updateConstruct, exportConstruct } from "@/api/project/construct";
import EnumBuild from "@/enums/EnumBuild";

export default {
  name: "SigleBuild",
  components: {
    HlUsing,
    Treeselect
  },
  data() {
    return {
      formLoading: false,
      //建筑类型
      equipmentType: EnumBuild.EnumBuildType.SINGLE_BUILD,
      // 建筑消防设施树选项
      categoryOptions: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 单体建筑表格数据
      siglebuildList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 耐火等级字典
      refractoryLevelOptions: [],
      structureTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptId: [
          {required: true, message: "项目id不能为空", trigger: "blur"}
        ],
        useNature: [
          {required: true, message: "使用性质不能为空", trigger: "blur"}
        ],
        buildName: [
          {required: true, message: "建筑名称不能为空", trigger: "blur"}
        ],
        // refractoryLevel: [
        //   {required: true, message: "耐火等级不能为空", trigger: "blur"}
        // ],
      }
    };
  },
  computed: {
    ...mapState({
      deptId: state => state.project.deptId
    })
  },
  mounted() {
    this.getList();
    this.getDicts("fire_resistance_level").then(response => {
      this.refractoryLevelOptions = response.data;
    });
    this.getDicts("structure_type").then(response => {
      this.structureTypeOptions = response.data;
    });
    this.getTreeselect();
  },
  methods: {
    /** 转换建筑消防设施数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.equipmentId,
        label: node.name,
        children: node.children
      };
    },
    /** 查询建筑消防设施下拉树结构 */
    getTreeselect() {
      getTree({type: this.equipmentType}).then(response => {
        this.categoryOptions = response.data;
      });
    },
    /** 查询单体建筑列表 */
    getList() {
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      this.queryParams.constructType=0;
      listConstruct(this.queryParams).then(response => {
        this.siglebuildList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 耐火等级字典翻译
    refractoryLevelFormat(row, column) {
      return this.selectDictLabel(this.refractoryLevelOptions, row.refractoryLevel);
    },
    structureTypeFormat(row, column) {
      return this.selectDictLabel(this.structureTypeOptions, row.structureType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        constructId: null,
        deptId: null,
        constructType: null,
        useNature: null,
        buildName: null,
        refractoryLevel: null,
        structureType: null,
        upperNumber: null,
        underNumber: null,
        buildHeight: null,
        buildLength: null,
        coversArea: null,
        floorArea: null,
        underFloorArea: null,
        storagePosition: null,
        storageSetType: null,
        storageType: null,
        storageMaterialName: null,
        storageTotalCapacity: null,
        yardMaterialName: null,
        yardName: null,
        yardTotalCapacity: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        deleteFlag: null,
        state: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.constructId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "单体建筑";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const constructId = row.constructId || this.ids
      getConstruct(constructId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "单体建筑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          if (this.form.constructId != null) {
            updateConstruct(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.formLoading = false;
              this.getList();
            });
          } else {
            /** 初始化项目ID */
            this.form.deptId = this.deptId;
            this.form.constructType=0;
            addConstruct(this.form).then(response => {

              this.msgSuccess("新增成功");
              this.open = false;
              this.formLoading = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const constructIds = row.constructId || this.ids;
      this.$confirm('是否确认删除单体建筑编号为"' + constructIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delConstruct(constructIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有单体建筑数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportSiglebuild(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
