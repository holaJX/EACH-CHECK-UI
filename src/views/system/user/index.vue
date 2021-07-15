<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入单位名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24"
      >
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="账号名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入账号名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
              v-hasPermi="['system:user:add']"
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
              v-hasPermi="['system:user:edit']"
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
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="账号名称" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户姓名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="角色" align="center" key="roleIdsStrDictLabel" prop="roleIdsStrDictLabel" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[4].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[5].visible" width="120" />
          <el-table-column label="启用状态" align="center" key="status" v-if="columns[6].visible">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[7].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['system:user:resetPwd']"
              >重置</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="1400px" append-to-body>
      <el-row :gutter="80">
        <el-col :span="8" style="padding-right: 4px;padding-left: 40px">
          <el-card class="box-card" >
            <div slot="header" class="clearfix">
              <span>基础信息</span>
            </div>
            <div class="card-form-warp">
              <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户姓名" prop="nickName">
                  <el-input v-model="form.nickName" placeholder="请输入用户姓名" />
                </el-form-item>
                <el-form-item label="所属组织" prop="deptId">
                  <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择所属组织" />
                </el-form-item>
                <el-form-item v-if="form.userId == undefined" label="手机号码" prop="phonenumber">
                  <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
                <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                  <el-input placeholder="请输入用户密码" v-model="form.password" show-password/>
                </el-form-item>
                <el-form-item label="用户性别">
                  <el-select v-model="form.sex" placeholder="请选择">
                    <el-option
                      v-for="dict in sexOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="使用状态">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="岗位类别">
                  <el-select v-model="form.postIds" multiple placeholder="请选择岗位类别">
                    <el-option
                      v-for="item in postOptions"
                      :key="item.postId"
                      :label="item.postName"
                      :value="item.postId"
                      :disabled="item.status == 1"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用户角色">
                  <el-select v-model="form.roleIds" multiple placeholder="请选择用户角色">
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                      :disabled="item.status == 1"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

        </el-col>
        <el-col :span="16" style="padding-left: 4px;padding-right: 40px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>证件信息</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="openCertificate">添加</el-button>
            </div>
            <div class="id-card-wrap">
              <el-card v-for="item in certificates" :key="item.certificateId" class="id-card-item" >
                <div slot="header" class="clearfix">
                  <span style="padding-right: 30px;">
                    <span style="width: 300px">证件名称:&nbsp;{{item.certificateName}}</span>
                  </span>
                  <span>证件编号:{{item.certificateCode}}</span>
                  <span style="float: right; padding: 3px 0;color: red" @click="handleItem(item.certificateId)"><i class="el-icon-close"></i></span>
                </div>
                <div class="id-card-picture" style="display: flex;justify-content: space-evenly">
                    <img :src="getUrl(item.certificateFrontUrl)" :style="imgStyle(item.certificateBackUrl)">
                    <img :src="getUrl(item.certificateBackUrl)" v-if="item.certificateType == 1" :style="imgStyle(item.certificateBackUrl)">
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :close-on-click-modal="false" :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--证件信息添加-->
    <el-dialog :close-on-click-modal="false" title="添加证件信息" :visible.sync="certificate.open" width="800px">
      <el-form>
        <el-form-item label="证件类别:" label-width="100px">
          <el-select clearable v-model="certificate.certificateType" placeholder="请选择">
            <el-option
              v-for="item in idTypes"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件编号:" label-width="100px">
          <el-input v-model="certificate.certificateCode" type="text" style="width: 95%"></el-input>
        </el-form-item>
        <el-form-item v-show="certificate.certificateType != 1" label="资格证名称:" label-width="100px">
          <el-select clearable v-model="form.certificateName" placeholder="请选择" @change="changeName">
            <el-option
              v-for="item in certificateTypeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="bottom clearfix" style="display: flex;justify-content: space-evenly">
          <image-upload v-model="certificate.certificateFrontUrl"></image-upload>
          <image-upload v-if="certificate.certificateType == 1" v-model="certificate.certificateBackUrl"></image-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCertificate">确 定</el-button>
        <el-button @click="closeCertificate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delCertificate, addCertificate } from "@/api/system/certificate";
import { listUser, getUser, delUser, addUser, updateUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import ImageUpload from '@/components/ImageUpload';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect,ImageUpload },
  data() {
    return {
      //证件类别
      idTypes: [],
      /**证件信息项*/
      certificate: {open: false},
      certificateTypeOptions: [],
      /**证件信息列表*/
      certificates: [],
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 单位名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        roleIds: [],
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `账号名称`, visible: true },
        { key: 2, label: `用户姓名`, visible: true },
        { key: 3, label: `角色`, visible: true },
        { key: 4, label: `部门`, visible: true },
        { key: 5, label: `手机号码`, visible: true },
        { key: 6, label: `状态`, visible: true },
        { key: 7, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_idtype").then(response => {
      this.idTypes = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
    this.getDicts("sys_user_certificate").then(response => {
      this.certificateTypeOptions = response.data;
    });
  },
  methods: {
    getUrl(url) {
      return  process.env.VUE_APP_BASE_API + url;
    },
    imgStyle(url) {
      return url == ''  ? {height: '200px',width: '100%',padding: '7px'}: {height: '200px',width: '50%',padding: '7px'};
    },
    changeName(val) {
      this.certificateTypeOptions.forEach(item => {
        if (item.dictValue == val) {
          this.certificate.certificateName = item.dictLabel;
        }
      })
    },
    handleItem(id) {
      let self = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCertificate(id).then(res => {
          if (res.code == '200') {
            getUser(self.form.userId).then(response => {
              self.certificates = response.certificates;
            })
          }
        })
      }).catch(() => {
      });

    },
    openCertificate() {
      this.certificate = {};
      this.certificate.open = true;
    },
    closeCertificate() {
      this.certificate = {};
      this.certificate.open = false;
    },
    saveCertificate() {
      let self = this
      if (this.form.userId > 0) {
        if (this.certificate.certificateType == '1') {
          this.certificate.certificateName = '身份证'
        }
        this.certificate.userId = this.form.userId;
        addCertificate(this.certificate).then(res => {
          if (res.code == '200') {
            getUser(self.form.userId).then(response => {
              self.certificates = response.certificates;
              self.certificates.certificateCode = '';
              self.certificates.certificateType = 1;
              self.certificates.certificateName = '';
              self.certificates.certificateFrontUrl = '';
              self.certificates.certificateBackUrl = '';
            })
            self.certificate.open = false;
          }
        })
      } else {
        self.$message({
          type: 'warning',
          message: "请先保存人员信息"
        })
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.userId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
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
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.certificates = [];
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加人员";
        this.form.phonenumber = '';
        this.form.password = '';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "人员管理";
        this.form.phonenumber = "";
        this.form.password = "";
        this.certificates = response.certificates;
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.msgSuccess("修改成功，新密码是" + value);
          });
        }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
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
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  },
  computed: {

  }
};
</script>
<style lang="scss" scoped>
.el-col-8 {
  padding: 0;
}
.el-col-16 {
  padding: 0;
}
.el-card {
  border-radius: 0;
  .card-form-warp {
    .el-form {
      .el-form-item {
        margin-bottom: 12px;
      }
    }
  }
}
.id-card-wrap {
  overflow-y: scroll;
  height: 386px;
  .id-card-item {
    width: 100%;
    .clearfix {
      font-size: 12px;
    }
  }
}
.hl-select {
  .el-input__inner {

  }
}
</style>
