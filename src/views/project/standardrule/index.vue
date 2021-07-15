<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-radio-group v-model="queryStandardParams.type" @change="handleSelectQuery" size="mini" style="padding-bottom: 10px;">
        <el-radio-button
          v-for="dict in typeOptions"
          :key="dict.dictValue"
          :label="dict.dictValue"
        >{{ dict.dictLabel }}
        </el-radio-button>
      </el-radio-group>
    </el-form>
    <el-table
      v-loading="loading"
      :data="taskrecordList"
      border
      lazy
      :load="load"
      row-key="standardId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column fixed width="300" label="分部工程" align="left" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column width="200" label="A类" align="center" prop="levelACount"/>
      <el-table-column width="200" label="B类" align="center" prop="levelBCount"/>
      <el-table-column width="200" label="C类" align="center" prop="levelCCount"/>
      <el-table-column width="200" label="A类缺陷判定规则" align="center" prop="">
        <template slot-scope="scope">
         <div class="standard-rule">
           <span class="W50px">A =</span>
           <input type="text"
                  size="mini"
                  v-model="scope.row.judgeRuleA"
                  autocomplete="off"
                  class="el-input__inner"
           >
         </div>
        </template>

      </el-table-column>
      <el-table-column width="200" label="B类缺陷判定规则" align="center" prop="">
        <template slot-scope="scope">
          <div class="standard-rule">
            <span class="W50px">B <=</span>
            <input type="text"
                   v-model="scope.row.judgeRuleB"
                   autocomplete="off"
                   class="el-input__inner">
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="C类缺陷判定规则" align="center" prop="">
        <template slot-scope="scope">
          <div class="standard-rule">
            <span class="W50px">B+C <=</span>
            <input type="text"
                   v-model="scope.row.judgeRuleC"
                   autocomplete="off"
                   class="el-input__inner">
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" min-width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAdd(scope.row)"
          >保存
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

  </div>
</template>

<script>
import {
  listStandard,
  getTree,
  addStandard,
  updateStandard
} from "@/api/project/standardrule";
import FileUpload from '@/components/FileUpload';
import Editor from '@/components/Editor';

export default {
  name: "Standardrule",
  components: {
    FileUpload,
    Editor,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      taskType: null,
      projectId: null,
      standardId: null,
      taskrecordList: [],
      // 查询参数
      selectStandardCategoryList: [],
      queryStandardParams: {
        type: '0'
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskType: null,
        projectId: null,
        standardId: null,
        standardId: null,
        checkSummary: null,

      },
      // 表单参数
      form: {},
      typeOptions: [],
      // 表单校验
      rules: {
        taskId: [
          {required: true, message: "任务id不能为空", trigger: "blur"}
        ],
        projectId: [
          {required: true, message: "项目id不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getDicts("acceptance_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getList();
  },
  methods: {

    columnFormatter(row, column) {
      return row.accTaskRecord ? row.accTaskRecord[column.property] : '';
    },
    handleSelectQuery(value) {
      this.queryStandardParams.type = value
      console.log(value)
      this.getList();
    },

    /** 加载父级列表 */
    getList() {
      this.loading = true;
      this.queryParams.taskType = this.queryStandardParams.type;
      listStandard(this.queryParams).then(response => {
        this.taskrecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 懒加载树结构*/
    load(tree, treeNode, resolve) {
      console.log(tree.standardId)
      this.queryParams.standardId = tree.standardId
      getTree(this.queryParams).then(response => {
        resolve(
          response.data
        )
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {

    },
    /** 重置按钮操作 */
    resetQuery() {

    },
    /** 保存按钮 */
    handleAdd(row) {
      console.log(row)
      const age = /^[0-9]+(\.?[0-9]+)?$/;
      let data = {
        standardId: row.standardId,
        judgeRuleA: row.judgeRuleA,
        judgeRuleB: row.judgeRuleB,
        judgeRuleC: row.judgeRuleC
      };
      if (data.judgeRuleA == null || data.judgeRuleB == null || data.judgeRuleC == null) {
        this.msgInfo("请填写完整内容");
      } else if (!age.test(data.judgeRuleA)) {
        this.msgInfo("只能填写小数");
      } else if (!age.test(data.judgeRuleB)) {
        this.msgInfo("只能填写小数");
      } else if (!age.test(data.judgeRuleC)) {
        this.msgInfo("只能填写小数");
      } else {
        updateStandard(data).then(response => {
          this.msgSuccess("保存成功");
        });
      }

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.standardId);
      this.standardId = row.standardId;
      let Obj = {
        standardId: row.standardId,
        judgeRuleA: row.judgeRuleA,
        judgeRuleB: row.judgeRuleB,
        judgeRuleC: row.judgeRuleC
      };
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.accTaskRecordItemList = this.accTaskRecordItemList;
          this.form.projectId = this.projectId;
          this.form.taskType = this.taskType;
          this.form.standardId = this.standardId;
          if (this.form.recordId != null) {
            updateTaskrecord(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTaskrecord(this.form).then(response => {
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
      const recordIds = row.recordId || this.ids;
      this.$confirm('是否确认删除任务记录编号为"' + recordIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTaskrecord(recordIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 任务记录详情序号 */
    rowAccTaskRecordItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 任务记录详情添加按钮操作 */

    /** 单选框选中数据 */
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有任务记录数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportTaskrecord(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
}
;
</script>
<style lang="scss" scoped>
.evaluation-wrapper {
  .evaluation-top {
    padding: 15px;

    .evaluation-top-item {
      height: 6px;
      line-height: 6px;
    }
  }

  .evaluation-msg {
    border: 1px solid #999;
    padding: 15px;

    .evaluation-msg-form {
      border: 1px solid #E6E6E6;
      padding-right: 7px;
      width: 98%;

      .evaluation-msg-form-top {
        display: block;
        font-size: 16px;
        color: #00afff;
        text-align: center;
        padding-bottom: 15px;
      }
    }
  }

  .evaluation-tab {
    margin-top: 15px;
  }

  .evaluation-bottom {
    width: 100%;
    display: flex;
    padding-top: 15px;
    justify-content: center;
  }
}
.standard-rule {
  display: flex;justify-content: space-evenly;align-items: center;
  .el-input__inner {
    width: 80%;
    height: 28px;
  }
}
</style>

