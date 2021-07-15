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
          v-hasPermi="['project:yard:add']"
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
          v-hasPermi="['project:yard:edit']"
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
          v-hasPermi="['project:yard:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="yardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="堆场名称" align="center" prop="yardName"/>
      <el-table-column label="堆场类别" align="center" prop="useNatureDictLabel"/>
      <el-table-column label="存储物质名称" align="center" prop="yardMaterialName"/>
      <el-table-column label="总储量(立方米)" align="center" prop="yardTotalCapacity"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:yard:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:yard:remove']"
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

    <!-- 添加或修改堆场对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="堆场名称" prop="yardName">
          <el-input v-model="form.yardName" placeholder="请输入堆场名称"/>
        </el-form-item>
        <el-form-item label="堆场类别" prop="useNature">
          <treeselect :defaultExpandLevel="Infinity" :disable-branch-nodes="true" v-model="form.useNature"
                      :options="categoryOptions" :normalizer="normalizer" placeholder="请选择堆场类别"/>
        </el-form-item>
        <el-form-item label="存储物质名称" prop="yardMaterialName">
          <el-input v-model="form.yardMaterialName" placeholder="请输入存储物质名称"/>
        </el-form-item>
        <el-form-item label="总储量" prop="yardTotalCapacity">
          <el-input v-model="form.yardTotalCapacity" placeholder="请输入总储量">
            <template slot="append">m<sup>3</sup></template>
          </el-input>
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
import {mapState} from "vuex";
import HlUsing from '@/components/HlUsing';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getTree, getEquipment} from "@/api/project/equipment";

import { listConstruct, getConstruct, delConstruct, addConstruct, updateConstruct, exportConstruct } from "@/api/project/construct";
import EnumBuild from "@/enums/EnumBuild";

export default {
  name: "StockYard",
  components: {
    HlUsing,
    Treeselect
  },
  data() {
    return {
      formLoading: false,
      //建筑类型
      equipmentType: EnumBuild.EnumBuildType.STOCK_YARD,
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
      // 堆场表格数据
      yardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectId: [
          {required: true, message: "项目id不能为空", trigger: "blur"}
        ],
        yardName: [
          {required: true, message: "堆场名称不能为空", trigger: "blur"}
        ],
        useNature: [
          {required: true, message: "堆场类别", trigger: "blur"}
        ],
        // storageMaterialName: [
        //   {required: true, message: "存储物质名称", trigger: "blur"}
        // ],
        // storageCapacity: [
        //   {
        //     pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/,
        //     message: "请输入正确的数字",
        //     trigger: "blur"
        //   },
        //   {required: true, message: "总储量", trigger: "blur"}
        // ],
      }
    };
  },
  mounted() {
    this.getList();
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
    /** 查询堆场列表 */
    getList() {
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      this.queryParams.constructType=2;
      listConstruct(this.queryParams).then(response => {
        this.yardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.title = "堆场";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const constructId = row.constructId || this.ids
      getConstruct(constructId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "堆场";
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
            this.form.constructType=2;
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
      this.$confirm('是否确认删除堆场编号为"' + constructIds + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有堆场数据项?', "警告", {
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
