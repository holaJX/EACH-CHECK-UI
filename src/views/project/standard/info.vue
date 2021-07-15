<template>
  <div class="app-container">
    <div style="height: 75vh;overflow-y: scroll;border: 1px solid #999;padding: 15px 20px;" v-if="isShow">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-row>
              <el-col :span="14">
                <el-form-item label="分部名称" prop="standardParentName">
                  <el-input class="no-border-input" v-model="form.standardParentName" type="text" placeholder="请输入内容"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="权重" prop="standardParentProportion">
                  <el-input class="no-border-input" v-model="form.standardParentProportion" type="text" placeholder="请输入内容"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="14">
                <el-form-item label="分项名称" prop="standardName">
                  <el-input class="no-border-input" v-model="form.standardName" type="text" placeholder="请输入内容"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="权重" prop="standardProportion">
                  <el-input class="no-border-input" v-model="form.standardProportion" type="text" placeholder="请输入内容"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>

          <el-col :span="18">
            <el-form-item label="检查内容" prop="name">
              <el-input v-model="form.name" type="text" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权重" prop="proportion">
              <el-input v-model="form.proportion" type="text" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联监督检查" prop="acceptanceSupervise">
              <el-input v-model="form.acceptanceSupervise" type="text" placeholder="请输入关联监督检查"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类型" prop="deptType">
              <treeselect v-model="form.deptType" :options="deptOptions" :value-consists-of="valueConsistsOf" :normalizer="deptNormalizer" :multiple="multiple" placeholder="请选择单位类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用场所" prop="placeType">
              <treeselect v-model="form.placeType" :options="placeOptions" :value-consists-of="valueConsistsOf" :normalizer="placeNormalizer" :multiple="multiple" placeholder="请选则适用场所" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行标准" prop="standardReference">
              <hl-select v-model="form.standardReference" dict-code="current_standards"
                         placeholder="请选择执行标准"></hl-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽样要求" prop="samplingReq">
              <el-input v-model="form.samplingReq" placeholder="请输入抽样要求"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查方法" prop="acceptanceMethod">
              <editor v-model="form.acceptanceMethod" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="管理要求" prop="technicalReq">
              <editor v-model="form.technicalReq" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="典型问题" prop="typicalProblem">
              <editor v-model="form.typicalProblem" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用项目" prop="applyProject">
              <el-input v-model="form.applyProject" placeholder="请输入适用项目"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="记录模板" prop="recordTemplate">
              <editor v-model="form.recordTemplate" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="center">验收标准子项信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddAccStandardItem">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteAccStandardItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="accStandardItemList" :row-class-name="rowAccStandardItemIndex"
                  @selection-change="handleAccStandardItemSelectionChange" ref="accStandardItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="名称" prop="name" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请输入名称"/>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="description" min-width="300">
            <template slot-scope="scope">
              <el-input v-model="scope.row.description" placeholder="请输入描述" type="textarea"/>
            </template>
          </el-table-column>
          <el-table-column label="子项限制最小值(包含)" prop="limitMinValue">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitMinValue" placeholder="请输入子项限制最小值"/>
            </template>
          </el-table-column>
          <el-table-column label="子项限制最大值(不包含)" prop="limitMaxValue">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitMaxValue" placeholder="请输入子项限制最大值"/>
            </template>
          </el-table-column>
          <el-table-column label="子项限制单位" prop="limitUnit">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitUnit" placeholder="请输入子项限制单位"/>
            </template>
          </el-table-column>
          <el-table-column label="子项限制等级" prop="limitLevel">
            <template slot-scope="scope">
              <hl-select v-model="scope.row.limitLevel" dict-code="engineering_importance"
                         placeholder="请选择限制等级"></hl-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { listStandard, getStandard, delStandard, addStandard, updateStandard, exportStandard } from "@/api/project/standard";
import Editor from '@/components/Editor/index';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listPlace, treePlace} from '@/api/project/place';
import { listCompany } from "@/api/project/company";
import { stringTransArr } from '@/utils/stringUtil'

export default {
  name: "Demand",
  components: {Treeselect, Editor},
  data() {
    return {
      // 遮罩层
      loading: true,
      valueConsistsOf: 'LEAF_PRIORITY',
      isShow: false,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedAccStandardItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 验收标准内容表格数据
      demandList: [],
      // 验收标准子项表格数据
      accStandardItemList: [],
      deptOptions:[],
      placeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        standardId: null,
        standardReference: null,
        standardType: null,
        assessmentstandardId: null,
        acceptanceName: null,
        acceptanceMethod: null,
        technicalReq: null,
        typicalProblem: null,
        applyProject: null,
        samplingReq: null,
        evaluateRule: null,
        recordTemplate: null,
        state: null
      },
      standardId:null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        standardId: [
          {required: true, message: "验收项节点id不能为空", trigger: "blur"}
        ],
        standardReference: [
          {required: true, message: "引用标准不能为空", trigger: "change"}
        ],
        standardType: [
          {required: true, message: "标准类型不能为空", trigger: "change"}
        ],
        acceptanceName: [
          {required: true, message: "验收内容不能为空", trigger: "blur"}
        ],
        /*acceptanceMethod: [
          {required: true, message: "验收方法不能为空", trigger: "blur"}
        ],
        technicalReq: [
          {required: true, message: "技术要求不能为空", trigger: "blur"}
        ],*/
      },
      //验收类型
      standardCategory: undefined,
      // 标准树选项
      standardOptions: [],
      assessmentDemandOptions: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
    };
  },
  mounted() {
    this.reset();
    this.getList();
    const tableId = this.$route.params && this.$route.params.tableId;
    if (tableId) {
      this.getDemand(tableId)
    }
    this.getTreeSelect()
  },
  watch: {
    'standardId': function (n,o) {
      this.selectStandard1();
    },
    'form.deptType':function (n,o) {
      this.getTreePlace();
    }
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        standardId: null,
        standardReference: null,
        standardType: null,
        acceptanceSupervise: null,
        acceptanceName: null,
        acceptanceMethod: null,
        technicalReq: null,
        typicalProblem: null,
        applyProject: null,
        samplingReq: null,
        evaluateRule: null,
        recordTemplate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        state: null,
        standardName: null,
        standardParentName: null,
        standardProportion: null,
        standardParentProportion: null
      };
      this.accStandardItemList = [];
      this.resetForm("form");
    },
    getList() {
      this.loading = true;
      listStandard(this.queryParams).then(response => {
        this.standards = response.data;
      });
    },
    /** 获取验收项 */
    getDemand(standardId) {
      this.reset();
      let self = this;
      getStandard(standardId).then(response => {
        self.form = response.data;
        self.standardId = response.data.standardId;
        this.form.deptType = stringTransArr(this.form.deptType);
        this.form.placeType = stringTransArr(this.form.placeType);
        let parenId = response.data.parentId;
        getStandard(parenId).then(resp => {
          self.form.standardName = resp.data.name;
          self.form.standardProportion = resp.data.proportion;
          let groundId = resp.data.parentId;
          getStandard(groundId).then(resp => {
            self.form.standardParentName = resp.data.name;
            self.form.standardParentProportion = resp.data.proportion;
            self.isShow = true;
          })
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.deptType = this.form.deptType.join(',');
          this.form.placeType = this.form.placeType.join(',');
          this.form.accStandardItemList = this.accStandardItemList;
          this.form.ancestors = this.getAncestors(this.form.parentId);
          if (this.form.standardId != null) {
            updateStandard(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.reset();
              this.closeTab()
            });
          } else {
            addStandard(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.reset();
              this.closeTab();
            });
          }
        }
      });
    },
    cancel() {
      this.closeTab();
    },
    /** 验收标准子项序号 */
    rowAccStandardItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 验收标准子项添加按钮操作 */
    handleAddAccStandardItem() {
      let obj = {};
      obj.name = "";
      obj.description = "";
      obj.limitMinValue = "";
      obj.limitMaxValue = "";
      obj.limitUnit = "";
      obj.limitLevel = "";
      obj.remark = "";
      obj.state = "";
      this.accStandardItemList.push(obj);
    },
    /** 验收标准子项删除按钮操作 */
    handleDeleteAccStandardItem() {
      if (this.checkedAccStandardItem.length == 0) {
        this.$alert("请先选择要删除的验收标准子项数据", "提示", {confirmButtonText: "确定",});
      } else {
        this.accStandardItemList.splice(this.checkedAccStandardItem[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleAccStandardItemSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.accStandardItem.clearSelection();
        this.$refs.accStandardItem.toggleRowSelection(selection.pop());
      } else {
        this.checkedAccStandardItem = selection;
      }
    },
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.standardId,
        label: node.name,
        children: node.children
      }
    },
    async selectStandard1() {
      this.assessmentDemandOptions = [];
      let assessmentStandardId = null;
      if (this.standardId) {
        await getStandard(this.standardId).then(response => {
          this.standardCategory = response.data.type;
          assessmentStandardId = response.data.assessmentStandardId;
        });

        if ((this.standardCategory == '1' || this.standardCategory == '2') && assessmentStandardId != null) {
          await getInspectionAndDetectionDemand(assessmentStandardId).then(response => {
            console.log(response)
            this.assessmentDemandOptions = response.data;
          })
        }
      }
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listCompany().then(response => {
        this.deptOptions = [];
        const data = { companyId: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "companyId", "parentId");
        this.deptOptions.push(data);
      });
    },
    getTreePlace(){
      treePlace({companyTypes:this.form.deptType}).then(response => {
        this.placeOptions = response.data
      });
    },
    /** 转换单位类型数据结构 */
    deptNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.companyId,
        label: node.name,
        children: node.children
      };
    },
    placeNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.placeId,
        label: node.name,
        children: node.children
      };
    },
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
<style scoped lang="scss">
.dialog-footer {
  display: flex;
  margin-top: 15px;
  justify-content: center;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 12px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  //-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #1890ff;
  //-webkit-box-shadow:inset006pxrgba(0,0,0,1);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: #1890ff;
}
</style>
