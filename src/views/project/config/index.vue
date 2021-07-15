<template>
  <div class="app-container">
      <div class="container-left">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:config:add']"
        >新增</el-button>
        <el-input placeholder="请输入选择条件" v-model="queryParams.deptName" clearable class="hl-drawer-search">
          <template slot="append" class="append">
            <el-button class="hl-btn" type="primary" @click="getList" size="small">搜索</el-button>
          </template>
        </el-input>
        <div class="config-list">
          <el-card class="box-card item" shadow="hover" v-for="config in configList" :key="config.scheduleId">
            <span>{{config.scheduleType}}</span>
          </el-card>
        </div>
      </div>
      <div class="container-right">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务类型" prop="scheduleType">
                  <el-select v-model="form.scheduleType" placeholder="请选择任务类型" @change="selectedScheduleType">
                    <el-option
                      v-for="item in taskTypeOption"
                      :key="item.standardId"
                      :label="item.name"
                      :value="item.standardId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务名称" prop="scheduleName">
                  <el-input  v-model="form.scheduleName" placeholder="请输入任务名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker clearable size="small"
                                  v-model="form.startTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择开始时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务状态">
                  <el-radio-group v-model="form.state">
                    <el-radio :label="item.dictLabel" :value="item.dictValue" :key="item.dictValue" v-for="item in taskStateOption"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <el-date-picker clearable size="small"
                                  v-model="form.endTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用对象" prop="applyObject">
                  <el-input v-model="form.applyObject" type="text" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="检查频次" prop="scheduleFrequency">
                  <el-select v-model="form.scheduleFrequency" placeholder="请选择检查频次">
                    <el-option
                      v-for="item in checkFrequencyOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安排人员" prop="createUsername">
                  <el-input v-model="form.createUsername" placeholder="请输入安排人员" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注说明" prop="remark">
                  <el-input class="remark" type="textarea"  v-model="form.remark" placeholder="请输入备注说明" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安排时间" prop="scheduleName">
                  <el-input  v-model="form.scheduleName" placeholder="请输入安排时间" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准类型" prop="applyStandard">
                  <el-checkbox-group v-model="checkList" style="position: absolute;left: -45px;top: 40px">
                    <el-checkbox style="display: block" label="复选框 A"></el-checkbox>
                    <el-checkbox style="display: block" label="复选框 B"></el-checkbox>
                    <el-checkbox style="display: block" label="复选框 C"></el-checkbox>
                    <el-checkbox style="display: block" label="禁用"></el-checkbox>
                    <el-checkbox style="display: block" label="选中且禁用"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用范围" prop="applyRange">
                  <treeselect v-model="form.applyRange" :options="applyRangeOptions" value-consists-of="BRANCH_PRIORITY" :alwaysOpen="true" :defaultExpandLevel="2" :normalizer="applyRangeNormalizer" :multiple="multiple" placeholder="请选择单位类型" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig, exportConfig } from "@/api/project/config";
import { stringTransArr } from '@/utils/stringUtil'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listCompany } from '@/api/project/company'
import { listStandard } from "@/api/project/standard";
export default {
  name: "Config",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      checkList: ['选中且禁用','复选框 A'],
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
      // 任务配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        scheduleType: null,
        scheduleName: null,
        createUsername: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      taskStateOption: [],
      taskTypeOption: [],
      applyRangeOptions: [],
      checkFrequencyOption: []
    };
  },
  created() {
    this.getList();
    this.getTreeSelect();
    this.getTaskTypeOption();
    this.getDicts('schedule_type').then(response => {
      this.taskStateOption = response.data;
    });
    this.getDicts('check_frequency').then(response => {
      this.checkFrequencyOption = response.data;
    });
  },
  methods: {
    getTaskTypeOption() {
      listStandard({level: 0}).then(res => {
        this.taskTypeOption = res.data;
      })
    },
    selectedScheduleType(val) {
      listStandard({ancestors:val}).then(res => {
        console.log(res.data)
      });
    },
    /** 查询任务配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows;
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
        scheduleId: null,
        deptId: null,
        scheduleType: null,
        scheduleName: null,
        scheduleFrequency: null,
        startTime: null,
        endTime: null,
        createUsername: null,
        applyRange: null,
        applyStandard: null,
        applyObject: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        deleteFlag: null,
        state: null
      };
      this.resetForm("form");
      this.form.applyStandard =  ['']
        // stringTransArr(this.form.applyStandard,',');
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
      this.ids = selection.map(item => item.scheduleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const scheduleId = row.scheduleId || this.ids
      getConfig(scheduleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.scheduleId != null) {
            updateConfig(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
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
      const scheduleIds = row.scheduleId || this.ids;
      this.$confirm('是否确认删除任务配置编号为"' + scheduleIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delConfig(scheduleIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
          const queryParams = this.queryParams;
          this.$confirm('是否确认导出所有任务配置数据项?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          }).then(() => {
            this.exportLoading = true;
            return exportConfig(queryParams);
          }).then(response => {
            this.download(response.msg);
            this.exportLoading = false;
        })
    },
    getTreeSelect() {
      listCompany().then(response => {
        this.applyRangeOptions = [];
        const data = { companyId: 0, name: '辖区社会单位', children: [] };
        data.children = this.handleTree(response.data, "companyId", "parentId");
        this.applyRangeOptions.push(data);
      });
    },
    /** 适用范围数据结构 */
    applyRangeNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.companyId,
        label: node.name,
        children: node.children
      };
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  background-color: #f4f4f4;
  padding: 0px;
  padding-top: 10px;
}
.container-left {
  width: 20%;
  height: 91vh;
  padding: 15px;
  position: absolute;
  left: 10px;
  background-color: white;
  /deep/ .hl-drawer-search {
    margin: 18px auto;
    .el-input__inner {
      height: 36px;
      line-height: 36px;
      width: 315px;
      border-radius: 10px;
    }
    .el-input-group__append {
      font-size: 18px;
      height: 36px;
      color: white;
      line-height: 36px;
      border-radius: 18px;
      background-color: #2979FF;
      margin-left: 10px;
    }
  }
}
.container-right {
  width: 78%;
  height: 91vh;
  margin-left: 1%;
  position: absolute;
  right: 15px;
  padding: 45px 15px 0px 15px;
  background-color: white;
}
.config-list {
  .item {
    width: 100%;
  }
}
.remark {
  /deep/ .el-textarea__inner {
    height: 120px;
    border-radius: 0;
  }
}
</style>
