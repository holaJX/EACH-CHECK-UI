<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="问题类型" prop="type">
        <hl-select v-model="queryParams.type" dict-code="question_type" placeholder="请选择问题类型" clearable size="small"></hl-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:question:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:question:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:question:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题类型" align="center" prop="typeDictLabel" />
      <el-table-column label="问题说明" align="center" prop="content" />
      <el-table-column label="图片记录" align="center" prop="picUrl" >
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.picUrl" @click="showProjectImage(scope.row.picUrl)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="反馈人员" align="center" prop="createByDictLabel" />
      <el-table-column label="联系电话" align="center" prop="phonenumber" />
      <el-table-column label="反馈时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:question:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:question:remove']"
          >删除</el-button>
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

    <!-- 添加或修改问题反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="问题类型" prop="type">
          <hl-select v-model="form.type" dict-code="question_type" placeholder="请选择问题类型"></hl-select>
        </el-form-item>
        <el-form-item label="问题说明">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="图片地址">
          <imageUpload v-model="form.picUrl"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 工程照片查看 -->
    <el-dialog width="40%" :show-close="false" :append-to-body="true" :visible.sync="projectImageOpen" custom-class="dialog-carousel-wrapper" :top="'200px'" center>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in projectImageList" :key="item">
          <img :src="getUrl(item)" style="width: 100%;" height="400px"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </div>
</template>

<script>
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion, exportQuestion } from "@/api/system/question";
import ImageUpload from '@/components/ImageUpload';
import Editor from '@/components/Editor';

export default {
  name: "Question",
  components: {
    ImageUpload,
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
      // 问题反馈表格数据
      questionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 问题类型字典
      typeOptions: [],
      //图片
      projectImageOpen:false,
      projectImageList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        content: null,
        picUrl: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("question_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询问题反馈列表 */
    getList() {
      this.loading = true;
      listQuestion(this.queryParams).then(response => {
        this.questionList = response.rows;
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
        id: null,
        title: null,
        poster: null,
        type: null,
        content: null,
        picUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        status: "0"
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加问题反馈";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuestion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "问题反馈详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateQuestion(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestion(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除问题反馈编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delQuestion(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问题反馈数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportQuestion(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    },
    //查看工程照片
    showProjectImage(imageUrls) {
      this.projectImageOpen = true
      this.projectImageList = imageUrls.split(',')
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
  }
}
</script>
