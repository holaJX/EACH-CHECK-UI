<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="type">
        <hl-select
          v-model="queryParams.type"
          dict-code="equipment_type"
          placeholder="请选择设施类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"></hl-select>
      </el-form-item>

      <el-form-item>
	      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:equipment:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      row-key="equipmentId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" align="left" prop="name" width="300"/>
      <el-table-column label="单位" align="center"  :formatter="unitFormat" />
      <el-table-column label="设施类型" align="center" prop="type" :formatter="equipmentFormat" />
      <el-table-column label="消防设施编号" align="center" prop="code" />
      <el-table-column label="技术参数" align="center" prop="technicalData" :show-overflow-tooltip="true" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="等级" align="center" prop="level" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:equipment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['project:equipment:add']"
            v-if="scope.row.level < 1"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:equipment:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改建筑消防设施对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="父节点" prop="parentId">
              <treeselect v-model="form.parentId" :options="categoryOptions" :normalizer="normalizer" placeholder="请选择消防设施父节点id" @select="select"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设施类型" prop="type">
              <hl-select v-model="form.type" dict-code="equipment_type" placeholder="请选择设施类型"></hl-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防设施编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入消防设施编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.level == 1">
            <el-form-item label="单位" prop="unit">
              <hl-select v-model="form.unit" dict-code="unit_type" placeholder="请选择单位"></hl-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.level == 1">
            <el-form-item label="技术参数" prop="technicalData">
              <el-input v-model="form.technicalData" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment, exportEquipment } from "@/api/project/equipment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Equipment",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 建筑消防设施表格数据
      categoryList: [],
      //字典
      equipmentOptions:[],
      unitOptions:[],
      // 建筑消防设施树选项
      categoryOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        parentId: null,
        //默认消防设施
        type: '6',
        code: null,
        name: null,
        unit: null,
        technicalData: null,
        orderNum: null,
        level: null,
        state: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "消防设施父节点id不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "设施不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "级别不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("equipment_type").then(response => {
      this.equipmentOptions = response.data;
    });
    this.getDicts("unit_type").then(response => {
      this.unitOptions = response.data;
    });
  },
  methods: {
    /** 查询建筑消防设施列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.categoryList = this.handleTree(response.data, "equipmentId", "parentId");
        this.loading = false;
      });
    },
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
      listEquipment().then(response => {
        this.categoryOptions = [];
        const data = { equipmentId: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "equipmentId", "parentId");
        this.categoryOptions.push(data);
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
        equipmentId: null,
        parentId: null,
        type: null,
        code: null,
        name: null,
        unit: null,
        technicalData: null,
        orderNum: null,
        level: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.equipmentId) {
        this.form.parentId = row.equipmentId;
        this.form.level = row.level + 1;
        this.form.type = row.type;
      } else {
        this.form.parentId = 0;
        this.form.level = 0;
      }
      this.open = true;
      this.title = "添加建筑消防设施";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.equipmentId;
      }
      getEquipment(row.equipmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改建筑消防设施";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.equipmentId != null) {
            updateEquipment(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquipment(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除建筑消防设施编号为"' + row.equipmentId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEquipment(row.equipmentId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    select(node, instanceId) {
      this.form.level = node.level + 1;
    },
    // 任务组名字典翻译
    equipmentFormat(row, column) {
      return this.selectDictLabel(this.equipmentOptions, row.type);
    },
    // 任务组名字典翻译
    unitFormat(row, column) {
      return this.selectDictLabel(this.unitOptions, row.unit);
    },
  }
};
</script>
