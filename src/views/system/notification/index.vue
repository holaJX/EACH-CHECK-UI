<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="消息标题" prop="notificationTitle">
        <el-input
          v-model="queryParams.notificationTitle"
          placeholder="请输入消息标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息类型" prop="notificationType">
        <hl-select v-model="queryParams.notificationType" dict-code="notification_type" placeholder="请选择消息类型" clearable size="small"></hl-select>
      </el-form-item>
      <el-form-item label="消息状态" prop="status">
        <hl-select v-model="queryParams.status" dict-code="sys_normal_disable" placeholder="请选择消息状态" clearable size="small"></hl-select>
      </el-form-item>
      <el-form-item label="推送状态" prop="pushState">
        <hl-select v-model="queryParams.pushState" dict-code="message_push_state" placeholder="请选择推送状态" clearable size="small"></hl-select>
      </el-form-item>
      <el-form-item label="接收状态" prop="receiverState">
        <hl-select v-model="queryParams.receiverState" dict-code="message_reciver_state" placeholder="请选择接收状态" clearable size="small"></hl-select>
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
          v-hasPermi="['system:notification:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notification:edit']"
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
          v-hasPermi="['system:notification:remove']"
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
          v-hasPermi="['system:notification:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="notificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息标题" align="center" prop="notificationTitle"  width="500"/>
      <el-table-column label="消息类型" align="center" prop="notificationTypeDictLabel" />
      <el-table-column label="消息状态" align="center" prop="statusDictLabel" />
      <el-table-column label="推送人" align="center" prop="pusherDictLabel" />
      <el-table-column label="推送状态" align="center" prop="pushStateDictLabel" />
      <el-table-column label="接收人" align="center" prop="receiverDictLabel" />
      <el-table-column label="接收状态" align="center" prop="receiverStateDictLabel" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="scope.row.editStatus == '1'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notification:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.editStatus == '1'"
            size="mini"
            type="text"
            icon="el-icon-bell"
            @click="handlePush(scope.row)"
            v-hasPermi="['system:notification:edit']"
          >推送</el-button>
          <el-button
            v-if="scope.row.editStatus == '1'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notification:remove']"
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

    <!-- 添加或修改消息通知对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="消息标题" prop="notificationTitle">
          <el-input v-model="form.notificationTitle" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="封面" prop="poster">
          <image-upload v-model="form.poster"></image-upload>
        </el-form-item>
        <el-form-item label="消息内容" prop="notificationContent">
          <editor v-model="form.notificationContent" :min-height="350"/>
        </el-form-item>
        <el-form-item label="消息状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="form.editStatus == '1'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotification, getNotification,pushNotification, delNotification, addNotification, updateNotification, exportNotification } from "@/api/system/notification";
import ImageUpload from '@/components/ImageUpload';
import Editor from '@/components/Editor';

export default {
  name: "Notification",
  components: {
    Editor,
    ImageUpload
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
      // 消息通知表格数据
      notificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 消息类型字典
      notificationTypeOptions: [],
      // 消息状态字典
      statusOptions: [],
      // 推送状态字典
      pushStateOptions: [],
      // 接收状态字典
      receiverStateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        notificationTitle: null,
        notificationType: null,
        notificationContent: null,
        status: null,
        pusher: null,
        pushState: null,
        receiver: null,
        receiverState: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        notificationTitle: [
          { required: true, message: "消息标题不能为空", trigger: "blur" }
        ],
        notificationType: [
          { required: true, message: "消息类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("notification_type").then(response => {
      this.notificationTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("message_push_state").then(response => {
      this.pushStateOptions = response.data;
    });
    this.getDicts("message_reciver_state").then(response => {
      this.receiverStateOptions = response.data;
    });
  },
  methods: {
    /** 查询消息通知列表 */
    getList() {
      this.loading = true;
      listNotification(this.queryParams).then(response => {
        this.notificationList = response.rows;
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
        notificationId: null,
        notificationTitle: null,
        notificationType: null,
        notificationContent: null,
        status: "0",
        pusher: null,
        pushState: null,
        receiver: null,
        receiverState: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.ids = selection.map(item => item.notificationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.notificationType = '2'
      this.form.editStatus = '1'
      this.title = "添加消息通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const notificationId = row.notificationId || this.ids
      getNotification(notificationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改消息通知";
      });
    },
    /** 修改按钮操作 */
    handleDetail(row) {
      this.reset();
      const notificationId = row.notificationId || this.ids
      getNotification(notificationId).then(response => {
        this.form = response.data;
        this.form.editStatus = '0'
        this.open = true;
        this.title = "消息通知详情";
      });
    },
    handlePush(row) {
      this.$confirm('是否确认推送消息通知编号为"' + row.notificationId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        pushNotification(row.notificationId).then(response => {})
      }).then(() => {
        this.getList();
        this.msgSuccess("推送成功");
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.notificationId != null) {
            updateNotification(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotification(this.form).then(response => {
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
      const notificationIds = row.notificationId || this.ids;
      this.$confirm('是否确认删除消息通知编号为"' + notificationIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotification(notificationIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
          const queryParams = this.queryParams;
          this.$confirm('是否确认导出所有消息通知数据项?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          }).then(() => {
            this.exportLoading = true;
            return exportNotification(queryParams);
          }).then(response => {
            this.download(response.msg);
            this.exportLoading = false;
        })
    }
  }
}
</script>
