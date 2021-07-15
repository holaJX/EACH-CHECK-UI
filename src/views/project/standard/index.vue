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
      <el-form-item label="引用标准" prop="standardReference">
        <el-input
          v-model="queryParams.standardReference"
          placeholder="请输入引用标准"
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
          v-hasPermi="['project:standard:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="standardList"
      row-key="standardId"
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="标准层级" align="left" prop="name" width="600" show-overflow-tooltip fixed/>
      <el-table-column label="比重" align="center" prop="proportion" />
      <el-table-column label="引用标准" align="center" prop="standardReferenceDictLabel" show-overflow-tooltip/>
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="操作" align="left" width="300" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:standard:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-if="scope.row.level <= 2"
            v-hasPermi="['project:standard:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:standard:remove']"
            style="color: red"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改验收标准对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父节点" prop="parentId">
          <treeselect v-model="form.parentId" :options="standardOptions" :normalizer="normalizer" placeholder="请选择父节点" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="比重" prop="proportion" v-if="form.level != 0">
          <el-input v-model="form.proportion" placeholder="请输入比重"/>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import { listStandard, getStandard, delStandard, addStandard, updateStandard, exportStandard } from "@/api/project/standard";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Editor from '@/components/Editor';

export default {
  name: "Standard",
  components: {
    Editor,
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      standards: [],
      // 验收标准表格数据
      standardList: [],
      // 验收标准树选项
      standardOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: null,
        standardReference: null,
        acceptanceName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "父节点不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        standardReference: [
          { required: true, message: "引用标准不能为空", trigger: "blur" }
        ],
        acceptanceName: [
          { required: true, message: "检查内容不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询验收标准列表 */
    getList() {
      this.loading = true;
      listStandard(this.queryParams).then(response => {
        this.standards = response.data;
        this.standardList = this.handleTree(response.data, "standardId", "parentId");
        this.loading = false;
      });
    },
    /** 转换验收标准数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.standardId,
        label: node.name,
        children: node.children
      };
    },
    /** 查询验收标准下拉树结构 */
    getTreeselect() {
      listStandard().then(response => {
        this.standardOptions = [];
        const data = { standardId: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "standardId", "parentId");
        this.standardOptions.push(data);
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
        standardId: null,
        parentId: null,
        name: null,
        proportion: null,
        standardReference: null,
        ancestors: null,
        acceptanceName: null,
        orderNum: null,
        acceptanceSupervise: null,
        level: null,
        acceptanceMethod: null,
        createBy: null,
        recordTemplate: null,
        createTime: null,
        deptType: null,
        updateBy: null,
        placeType: null,
        updateTime: null,
        technicalReq: null,
        remark: null,
        typicalProblem: null,
        delFlag: null,
        state: null,
        applyProject: null,
        samplingReq: null,
        levelACount: null,
        levelBCount: null,
        levelCCount: null
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
      if (row != null && row.standardId) {
        this.form.parentId = row.standardId;
        this.form.level = row.level + 1;
      } else {
        this.form.parentId = 0;
        this.form.level = 0;
      }
      this.open = true;
      this.title = "添加验收标准";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.level < 3) {
        this.reset();
        this.getTreeselect();
        if (row != null) {
          this.form.parentId = row.standardId;
        }
        getStandard(row.standardId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改验收标准";
        });
      } else {
        this.reset();
        const standardId = row.standardId || this.ids
        this.$router.push({ path: '/standard/EditStandardInfo/'+standardId})
      }

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.ancestors = this.getAncestors(this.form.parentId)
          if (this.form.standardId != null) {
            updateStandard(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStandard(this.form).then(response => {
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
      this.$confirm('是否确认删除验收标准编号为"' + row.standardId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delStandard(row.standardId);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /**获取祖籍ID*/
    getAncestors(parentId) {
      let ancestors = '0,';
      if (parentId == 0) {
        return 0
      }
      while (parentId != 0) {
        this.standards.forEach(item => {
          if (item.standardId == parentId) {
            ancestors += item.standardId + ',';
            parentId = item.parentId;
          }
        })
      }
      return ancestors.substr(0,ancestors.length-1);
    }
  }
};
</script>
