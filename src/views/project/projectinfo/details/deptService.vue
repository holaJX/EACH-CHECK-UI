<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->


<!--      <el-form-item label="服务类型" prop="serviceType">-->
<!--        <hl-select v-model="queryParams.serviceType" dict-code="service_dept_type" placeholder="请选择服务类型" clearable-->
<!--                   size="small"></hl-select>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="服务机构" prop="serviceName">-->
<!--        <el-tooltip content="如果没有对应服务机构，请联系注册！" placement="top" effect="light">-->
<!--          <el-select-->
<!--            class="hl-select"-->
<!--            style="width: 80%"-->
<!--            v-model="queryParams.serviceName"-->
<!--            :remote-method="serviceBlur"-->
<!--            remote clearable filterable reserve-keyword placeholder="输入搜索服务机构">-->
<!--            <el-option v-for="o in serviceOrganOptions"-->
<!--                       :key="o.deptId"-->
<!--                       :label="o.deptName"-->
<!--                       :value="o.deptId"/>-->
<!--          </el-select>-->
<!--        </el-tooltip>-->
<!--      </el-form-item>-->

<!--      &lt;!&ndash;      <el-form-item label="执行部门" prop="doDeptId">&ndash;&gt;-->
<!--      &lt;!&ndash;        <el-input&ndash;&gt;-->
<!--      &lt;!&ndash;          v-model="queryParams.doDeptId"&ndash;&gt;-->
<!--      &lt;!&ndash;          placeholder="请输入执行部门"&ndash;&gt;-->
<!--      &lt;!&ndash;          clearable&ndash;&gt;-->
<!--      &lt;!&ndash;          size="small"&ndash;&gt;-->
<!--      &lt;!&ndash;          @keyup.enter.native="handleQuery"&ndash;&gt;-->
<!--      &lt;!&ndash;        />&ndash;&gt;-->
<!--      &lt;!&ndash;      </el-form-item>&ndash;&gt;-->

<!--      <el-form-item label="检查类别" prop="checkType">-->
<!--        &lt;!&ndash;        <hl-select v-model="queryParams.checkType" dict-code="" placeholder="请选择检查类别" clearable size="small"></hl-select>&ndash;&gt;-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:deptService:add']"
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
          v-hasPermi="['project:deptService:edit']"
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
          v-hasPermi="['project:deptService:remove']"
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
          v-hasPermi="['project:deptService:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deptServiceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="服务机构id" align="center" prop="serviceId"/>-->
<!--      <el-table-column label="执行部门" align="center" prop="doDeptId"/>-->
<!--      <el-table-column label="是否是服务机构来检查" align="center" prop="isService"/>-->

      <el-table-column label="服务机构名称" align="center" prop="serviceName"/>
      <el-table-column label="服务类型" align="center" prop="serviceTypeDictLabel"/>
<!--      <el-table-column label="显示顺序" align="center" prop="orderNum"/>-->
      <el-table-column label="负责人" align="center" prop="leader"/>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="建筑范围" align="center" prop="setAreaLabel"/>
      <el-table-column label="设施范围" align="center" prop="equipmentRangeDictLabel"/>
      <el-table-column label="检查类别" align="center" prop="checkType"/>
      <el-table-column label="服务开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:deptService:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:deptService:remove']"
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

    <!-- 添加或修改服务机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">

        <el-form-item label="服务类型：" prop="serviceType">
          <hl-select v-model="queryParams.serviceType" dict-code="service_dept_type" placeholder="请选择服务类型" clearable
                     size="small"></hl-select>
        </el-form-item>

        <el-form-item label="服务机构：" prop="serviceName">
          <el-tooltip content="如果没有对应服务机构，请联系注册！" placement="top" effect="light">
            <el-select
              class="hl-select"
              style="width: 80%"
              v-model="form.serviceName"
              :remote-method="serviceBlur"
              remote clearable filterable reserve-keyword placeholder="输入搜索服务机构">
              <el-option v-for="o in serviceOrganOptions"
                         :key="o.deptId"
                         :label="o.deptName"
                         :value="o.deptId"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="负责人：" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人"/>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"/>
        </el-form-item>

        <el-form-item label="建筑范围：" prop="setAreaValue">
          <hl-cascader
            v-model="form.setAreaValue"
            :label="form.setAreaLabel"
            :show-all-levels="true"
            :props_="{multiple: true}"
            :options_="locationOptions"
            @change="changeSetArea"
          ></hl-cascader>
        </el-form-item>
        <el-form-item label="设施范围：" prop="deptType">
          <treeselect v-model="form.equipmentRange" :options="equipmentRangeOptions" value-consists-of="BRANCH_PRIORITY" :normalizer="deptNormalizer" :multiple="true" placeholder="请选择设施范围" />
        </el-form-item>
        <el-form-item label="检查类别：" prop="checkType">
          <!--          <hl-select v-model="form.checkType" dict-code="checkTypeOptions" placeholder="请选择检查类别"></hl-select>-->
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker clearable size="small"
                          v-model="form.startTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择服务开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker clearable size="small"
                          v-model="form.endTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择服务结束时间">
          </el-date-picker>
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
import Treeselect from "@riophae/vue-treeselect";
import {arrTransStr, arrUnique} from '@/utils/arrayUtil';
import HlCascader from '@/components/HlCascader';
import {listEquipment, getEquipment} from "@/api/project/equipment";
import {socialDeptList} from "@/api/system/dept";
import {
  listPosition
} from "@/api/project/fireequipment";
import {
  listDeptService,
  getDeptService,
  delDeptService,
  addDeptService,
  updateDeptService,
  exportDeptService
} from "@/api/project/deptService";
import {mapState} from "vuex";

export default {
  name: "DeptService",
  components: {
    HlCascader,
    Treeselect
  },
  data() {
    return {
      locationOptions: [],
      serviceOrganOptions: [],
      equipmentRangeOptions:[],
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
      // 服务机构表格数据
      deptServiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceId: null,
        doDeptId: null,
        isService: null,
        serviceType: null,
        serviceName: null,
        orderNum: null,
        leader: null,
        phone: null,
        constructRange: null,
        equipmentRange: null,
        checkType: null,
        startTime: null,
        endTime: null,
        state: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serviceId: [
          {required: true, message: "服务机构id不能为空", trigger: "blur"}
        ],
      }
    };
  },
  mounted() {
    this.getList();

  },
  created() {
    this.getList();
    this.getLocationOptions();
    this.getTreeSelect();
  },
  computed: {
    ...mapState({
      deptId: state => state.project.deptId
    })
  },
  methods: {

    deptNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.equipmentId,
        label: node.name,
        children: node.children
      };
    },
    getTreeSelect() {
      listEquipment({parentId: 0,type:'6'}).then(response => {
        this.equipmentRangeOptions=[];
        const data = { equipmentId: 0, name: '消防设施', children: [] };
        data.children = this.handleTree(response.data, "equipmentId", "parentId");
        this.equipmentRangeOptions.push(data);
      });
    },
    changeSetArea(data) {
      this.form.setAreaValue = data.v;
      let str = "";
      const labels = data.l.split(",");
      for (let i = 0; i < labels.length; i++) {
        str += "," + labels[i].split("/")[1];
      }
      this.form.setAreaLabel = str.substring(1);
    },
    serviceBlur(query) {
      socialDeptList({deptName: query, parentId: 300}).then(res => {
        this.serviceOrganOptions = res.rows;

      })
    },

    getLocationOptions(){
      listPosition({deptId: this.deptId}).then(res => {
        console.log(res)
        this.locationOptions = arrUnique(res.data.map(item => ({
          value: String(item.type),
          label: '',
          type: item.type,
          leave: 0,
          children: []
        })), 'value')
        this.locationOptions.forEach(pItem => {
          pItem.label = this.getPositionParentLabel(Number(pItem.type));
          res.data.forEach(cItem => {
            if (String(cItem.type) == String(pItem.value)) {
              pItem.children.push({
                value: String(cItem.value),
                leave: 1,
                label: cItem.label,
              })
            }
          })
        })
      })
    },
    getPositionParentLabel(value) {
      switch (value) {
        case 0:
          return '单体建筑';
        case 1:
          return '储罐';
        case 2:
          return '堆场';
      }
    },
    /** 查询服务机构列表 */
    getList() {
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      console.log(this.queryParams.deptId)
      listDeptService(this.queryParams).then(response => {
        this.deptServiceList = response.rows;
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
        serviceId: null,
        deptId: null,
        doDeptId: null,
        isService: null,
        serviceType: null,
        serviceName: null,
        orderNum: null,
        leader: null,
        phone: null,
        constructRange: null,
        equipmentRange: null,
        checkType: null,
        startTime: null,
        endTime: null,
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
      this.ids = selection.map(item => item.deptId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务机构";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deptId = row.deptId || this.ids
      getDeptService(deptId).then(response => {
        this.form = response.data;
        this.form.equipmentRange=this.form.equipmentRange.split(',');
        this.open = true;
        this.title = "修改服务机构";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.equipmentRange=this.form.equipmentRange.join(',');
          if (this.form.deptId != null) {
            updateDeptService(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.deptId = this.deptId;
            addDeptService(this.form).then(response => {
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
      const deptIds = row.deptId || this.ids;
      this.$confirm('是否确认删除服务机构编号为"' + deptIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDeptService(deptIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有服务机构数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportDeptService(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      })
    }
  }
}
</script>
