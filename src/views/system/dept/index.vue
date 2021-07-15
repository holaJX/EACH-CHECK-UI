<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="单位名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="使用状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
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

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" align="left" label="单位名称" ></el-table-column>
      <el-table-column prop="districtCodeDictLabel" label="地区" ></el-table-column>
      <el-table-column prop="deptTypeDictLabel" label="单位类型" width="100"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
      <el-table-column label="启用状态" align="center" key="status"  width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"  width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级机构" prop="parentId">
              <hl-dept :dept-id="form.parentId" @select-dept="val => form.parentId = val"></hl-dept>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类型" prop="deptType">
              <hl-select  v-model="form.deptType" dict-code="dept_type" placeholder="请选择单位类型"></hl-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人员" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入联系人员" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区域" prop="districtCode">
              <hl-region v-model="form.districtCode" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailedAddress">
              <el-input v-model="form.detailedAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '100' || rootId == '300'">
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" placeholder="统一社会信用代码" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '300'">
            <el-form-item label="法定代表人" prop="legalName">
              <el-input v-model="form.legalName" placeholder="法定代表人" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '300'">
            <el-form-item label="法人身份证号" prop="legalCode">
              <el-input v-model="form.legalCode" placeholder="法人身份证号" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '300'">
            <el-form-item label="技术负责人" prop="chargeName">
              <el-input v-model="form.chargeName" placeholder="技术负责人" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '300'">
            <el-form-item label="负责人身份证号" prop="chargeCode">
              <el-input v-model="form.chargeCode" placeholder="负责人身份证号" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="rootId == '100' || rootId == '300'">
            <el-form-item label="营业执照">
              <div class="bottom clearfix" style="display: flex;justify-content: space-between">
                <certificate-picture v-model="form.licenseUrl"></certificate-picture>
              </div>
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
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild,changeDeptStatus } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import HlRegion from '@/components/HlRegion';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CertificatePicture from '@/components/CertificatePicture';
import HlDept from '@/components/HlDept';
import {stringTransArr} from "@/utils/stringUtil";
export default {
  name: "Dept",
  components: { Treeselect,CertificatePicture,HlRegion,HlDept },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级机构不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        deptType: [
          { required: true, message: "单位类型不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ]
      },
      // 用于递归查找根节点
      depts: [],
      // 根节点ID
      rootId: ''

    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    getRootId(row) {
      if (row && row.parentId == 0) {
        return row.deptId;
      } else {
        let ancestors = stringTransArr(row.ancestors,",").map(String)
        for (const item of ancestors) {
          switch (item) {
              case "100":
                return 100;
              case "200":
                return 200;
              case "300":
                return 300;
          }
        }
      }
    },
    /** 递归查找根节点 */
    recursionSearchRootNode(parentId,deptList) {
      if (parentId && parentId != '') {
        for (let i = 0; i < deptList.length; i++) {
          let item = deptList[i];
          if (parentId == item.deptId) {
            parentId = item.parentId;
            if (item.parentId == 0) {
              return item.deptId
            } else {
              return this.recursionSearchRootNode(parentId,deptList);
            }
          }
        }
      } else {
        return '';
      }
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.depts = response.data;
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.deptName + '"部门吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeDeptStatus(row.deptId, row.status);
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
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        districtCode: undefined,
        detailedAddress: undefined,
        leader: undefined,
        phone: undefined,
        status: "0"
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
      this.rootId = this.getRootId(row)
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加单位信息";
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.rootId = this.getRootId(row)
      console.log(this.rootId)
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "单位信息";
      });
      listDeptExcludeChild(row.deptId).then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
