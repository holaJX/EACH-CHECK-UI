<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否最新" prop="isLast">
        <hl-select v-model="queryParams.isLast" dict-code="sys_yes_no" placeholder="请选择是否最新" clearable
                   size="small"></hl-select>
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
          v-hasPermi="['system:update:add']"
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
          v-hasPermi="['system:update:edit']"
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
          v-hasPermi="['system:update:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:update:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="updateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="updateId"/>
      <el-table-column label="版本号" align="center" prop="version"/>
      <el-table-column label="是否最新" align="center" prop="isLastDictLabel"/>
      <el-table-column label="应用URL" align="center" prop="appUrl"/>
      <el-table-column label="应用二维码" align="center" prop="qrcodeUrl"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:update:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:update:remove']"
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

    <!-- 添加或修改应用更新对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="请输入版本号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否最新">
              <el-radio-group v-model="form.isLast">
                <el-radio
                  v-for="dict in isLastOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="应用文件上传">
              <fileUpload v-model="form.appUrl" :fileType="fileType" :fileSize="fileSize"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="备注"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新内容">
              <editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="应用二维码">
              <imageUpload v-model="form.qrcodeUrl"/>
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
import {listUpdate, getUpdate, delUpdate, addUpdate, updateUpdate, exportUpdate} from "@/api/system/update";
import ImageUpload from '@/components/ImageUpload';
import FileUpload from '@/components/FileUpload';
import Editor from '@/components/Editor';

export default {
  name: "Update",
  components: {
    ImageUpload,
    FileUpload,
    Editor,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 应用更新表格数据
      updateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否最新字典
      isLastOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        version: null,
        content: null,
        appUrl: null,
        isLast: null,
        qrcodeUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      fileType: ["apk"],
      fileSize: 30,
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.isLastOptions = response.data;
    });
  },
  methods: {
    /** 查询应用更新列表 */
    getList() {
      this.loading = true;
      listUpdate(this.queryParams).then(response => {
        this.updateList = response.rows;
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
        updateId: null,
        version: null,
        content: null,
        appUrl: null,
        isLast: "",
        qrcodeUrl: null,
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
      this.ids = selection.map(item => item.updateId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.isLast = "Y";
      this.title = "添加应用更新";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const updateId = row.updateId || this.ids
      getUpdate(updateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改应用更新";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.updateId != null) {
            updateUpdate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUpdate(this.form).then(response => {
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
      const updateIds = row.updateId || this.ids;
      this.$confirm('是否确认删除应用更新编号为"' + updateIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delUpdate(updateIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有应用更新数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportUpdate(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    }
  }
}
</script>
