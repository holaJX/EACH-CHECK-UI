<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['system:region:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="regionList"
      row-key="id"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" align="left" prop="name" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="区划代码" align="center" prop="agencyId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:region:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:region:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:region:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改行政区划对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父ID" prop="parentId">
          <el-input v-model="form.parentIdDictLabel" placeholder="请选择父ID" readonly/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="区划代码" prop="agencyId">
          <el-input v-model="form.agencyId" placeholder="请输入区划代码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRegion, getRegion, delRegion, addRegion, updateRegion, exportRegion } from "@/api/system/region";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Region",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 行政区划表格数据
      regionList: [],
      // 行政区划树选项
      regionOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        name: null,
        type: null,
        parentId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "父ID不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        agencyId: [
          { required: true, message: "区划代码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("region_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询行政区划列表 */
    getList() {
      this.loading = true;
      listRegion(this.queryParams).then(response => {
        this.regionList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换行政区划数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
	/** 查询行政区划下拉树结构 */
    getTreeselect() {
      listRegion().then(response => {
        this.regionOptions = [];
        const data = { id: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.regionOptions.push(data);
      });
    },
    async load(tree, treeNode, resolve) {
      this.queryParams.parentId = tree.id
      let children = [];
      await listRegion(this.queryParams).then(response => {
        children = response.data
      });
      resolve(children)
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        parentId: null,
        name: null,
        type: null,
        agencyId: null
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
      if (row != null && row.id) {
        console.log(row)
        this.form.parentId = row.id;
        this.form.parentIdDictLabel = row.name;
      } else {
        this.form.parentId = 0;
        this.form.parentIdDictLabel = "顶点";
      }
      this.open = true;
      this.title = "添加行政区划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
        if (this.form.parentId == 0){
          this.form.parentIdDictLabel = "顶点";
        }else {
          this.form.parentIdDictLabel = row.name;
        }
      }
      getRegion(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改行政区划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRegion(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.queryParams.parentId = null
              this.getList();
            });
          } else {
            addRegion(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.queryParams.parentId = null
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除行政区划编号为"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRegion(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
  }
};
</script>
