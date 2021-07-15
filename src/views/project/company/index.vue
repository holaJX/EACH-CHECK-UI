<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关键词" prop="keyName">
        <el-input
          v-model="queryParams.keyName"
          placeholder="请输入关键词"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['project:company:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="companyList"
      row-key="companyId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="唯一关键词" align="left" prop="keyName"/>
      <el-table-column label="单位类型描述" align="left" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="排序" align="left" prop="orderNum" width="100"/>
      <el-table-column label="等级" align="left" prop="level" width="100"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:company:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['project:company:add']"
            v-if="scope.row.level !== 3"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:company:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改单位类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父节点" prop="parentId">
          <treeselect v-model="form.parentId" :options="companyOptions" :normalizer="normalizer" placeholder="请选择父节点"
                      disabled="disabled"/>
        </el-form-item>
        <el-form-item label="单位类型描述" prop="name">
          <el-input v-model="form.name" placeholder="请输入单位类型描述"/>
        </el-form-item>
        <el-form-item label="唯一关键词" prop="keyName">
          <el-input v-model="form.keyName" placeholder="请输入唯一关键词"/>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="请输入排序"/>
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
import {listCompany, getCompany, delCompany, addCompany, updateCompany, exportCompany} from "@/api/project/company";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getPlace} from "@/api/project/place";

export default {
  name: "Company",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 单位类型表格数据
      companyList: [],
      // 单位类型树选项
      companyOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        parentId: null,
        name: null,
        keyName: null,
        orderNum: null,
        ancestors: null,
        level: null,
        state: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyId: [
          {required: true, message: "单位类型不能为空", trigger: "blur"}
        ],
        parentId: [
          {required: true, message: "单位类型父节点id不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "单位类型描述不能为空", trigger: "blur"}
        ],
        keyName: [
          {required: true, message: "唯一关键词不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单位类型列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = this.handleTree(response.data, "companyId", "parentId");
        this.loading = false;
      });
    },
    /** 转换单位类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.companyId,
        label: node.name,
        children: node.children
      };
    },
    /** 查询单位类型下拉树结构 */
    getTreeselect(row,addOrEdit) {
      this.companyOptions = [];

      //新增
      if (addOrEdit == 1){
        if (row != null && row.companyId) {
          getCompany(row.companyId).then(response => {
            const data = {companyId: response.data.companyId, name: response.data.name, children: []};
            this.companyOptions.push(data);
          });
        }else {
          const data = {companyId: 0, name: '单位类型', children: []};
          this.companyOptions.push(data);
        }

      }else if (addOrEdit == 2){
        if (row.parentId == 0) {
          const data = {companyId: 0, name: '单位类型', children: []};
          this.companyOptions.push(data);
        } else {
          getCompany(row.parentId).then(response => {
            const data = {companyId: response.data.companyId, name: response.data.name, children: []};
            this.companyOptions.push(data);
          });
        }
      }

      /*listCompany().then(response => {
        this.companyOptions = [];
        const data = { companyId: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "companyId", "parentId");
        this.companyOptions.push(data);
      });*/
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        companyId: null,
        parentId: null,
        name: null,
        keyName: null,
        orderNum: null,
        ancestors: null,
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
      this.getTreeselect(row,1);
      if (row != null && row.companyId) {
        this.form.parentId = row.companyId;
        this.form.level = row.level + 1
      } else {
        this.form.level = 0
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加单位类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect(row,2);
      if (row != null) {
        this.form.parentId = row.companyId;
      }
      getCompany(row.companyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单位类型";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.companyId != null) {
            updateCompany(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$confirm('是否确认删除单位类型编号为"' + row.companyId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delCompany(row.companyId);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
