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
          v-hasPermi="['project:storagetank:add']"
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
          v-hasPermi="['project:storagetank:edit']"
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
          v-hasPermi="['project:storagetank:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storagetankList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="设置位置" align="center" prop="storagePosition"/>
      <el-table-column label="总储量(m³)" align="center" prop="storageTotalCapacity"/>
      <el-table-column label="设置形式" align="center" prop="storageSetType" :formatter="storageSetTypeFormat"/>
      <el-table-column label="存储形式" align="center" prop="storageType" :formatter="storageTypeFormat"/>
      <el-table-column label="存储物质类别" align="center" prop="useNatureDictLabel"/>
      <el-table-column label="存储物质名称" ialign="center" prop="storageMaterialName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:storagetank:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:storagetank:remove']"
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

    <!-- 添加或修改储罐对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="设置位置:" prop="storagePosition">
          <el-input class="input-width" v-model="form.storagePosition" placeholder="请输入设置位置"/>
        </el-form-item>
        <el-form-item label="总储量:" prop="storageTotalCapacity">
          <el-input v-model="form.storageTotalCapacity" placeholder="请输入总储量">
            <template slot="append">m<sup>3</sup></template>
          </el-input>
        </el-form-item>
        <el-form-item label="设置形式:" prop="storageSetType">
          <el-select class="input-width-select" v-model="form.storageSetType" placeholder="请选择设置形式">
            <el-option
              v-for="dict in storageSetTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存储形式:" prop="storageType">
          <el-select  class="input-width-select" v-model="form.storageType" placeholder="请选择存储形式">
            <el-option
              v-for="dict in storageTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="储存物质类别:" prop="useNature">
          <treeselect  class="input-width" :defaultExpandLevel="Infinity" :disable-branch-nodes="true" v-model="form.useNature"
                      :options="categoryOptions" :normalizer="normalizer" placeholder="请选择储存物质类别"/>
        </el-form-item>
        <el-form-item label="存储物质名称:" prop="storageMaterialName">
          <el-input  class="input-width" v-model="form.storageMaterialName" placeholder="请输入存储物质名称"/>
        </el-form-item>
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
  name: "StorageTank",
  components: {
    HlUsing,
    Treeselect
  },
  data() {
    return {
      formLoading: false,
      //建筑类型
      equipmentType: EnumBuild.EnumBuildType.STORAGE_TANK,
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
      // 储罐表格数据
      storagetankList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设置形式字典
      storageSetTypeOptions: [],
      // 存储形式字典
      storageTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storageType: null,
        storageMaterialName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectId: [
          {required: true, message: "项目id不能为空", trigger: "blur"}
        ],
        useNature: [
          {required: true, message: "存储物质类别", trigger: "blur"}
        ],
        // storageMaterialName: [
        //   {required: true, message: "存储物质名称", trigger: "blur"}
        // ],
        storagePosition: [
          {required: true, message: "位置为空", trigger: "blur"}
        ],
        // storageTotalCapacity: [
        //   {
        //     pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/,
        //     message: "请输入正确的数字",
        //     trigger: "blur"
        //   },
        //   {required: true, message: "总储量", trigger: "blur"}
        // ],
        // storageSetType: [
        //   {required: true, message: "设置形式", trigger: "blur"}
        // ],
        // storageType: [
        //   {required: true, message: "存储形式", trigger: "blur"}
        // ],
      }
    };
  },
  mounted() {
    this.getList();
    this.getDicts("setting_type").then(response => {
      this.storageSetTypeOptions = response.data;
    });
    this.getDicts("storage_type").then(response => {
      this.storageTypeOptions = response.data;
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
    /** 查询储罐列表 */
    getList() {
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      this.queryParams.constructType=1;
      listConstruct(this.queryParams).then(response => {
        this.storagetankList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 设置形式字典翻译
    storageSetTypeFormat(row, column) {
      return this.selectDictLabel(this.storageSetTypeOptions, row.storageSetType);
    },
    // 存储形式字典翻译
    storageTypeFormat(row, column) {
      return this.selectDictLabel(this.storageTypeOptions, row.storageType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        storagetankId: null,
        projectId: null,
        useNature: null,
        storagePosition: null,
        storageTotalCapacity: null,
        storageSetType: null,
        storageType: null,
        storageMaterialName: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
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
      this.title = "储罐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const constructId = row.constructId || this.ids
      getConstruct(constructId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "储罐";
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
            /** 设置项目ID */
            this.form.deptId = this.deptId;
            this.form.constructType=1;

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
      this.$confirm('是否确认删除储罐编号为"' + constructIds + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有储罐数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportConstruct(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  },
  computed: {
    ...mapState({
      deptId: state => state.project.deptId
    })
  },
};
</script>
<style lang="scss" scoped>
.input-width {
  width: 640px;
}
/deep/ .input-width-select {
  .el-input {
    width: 640px;
  }
}
</style>
