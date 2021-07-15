<template>
  <div class="app-container">
    <div>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="设施类型" prop="equipmentCategoryId">
          <el-cascader
            :props="installationProps"
            v-model="queryParams.equipmentCategoryId"
            @change="changeEquipmentType"
            :show-all-levels="false"></el-cascader>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input
            v-model="queryParams.manufacturer"
            placeholder="请输入生产厂家"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设置区域" prop="setAreaValue">
          <hl-cascader
            ref = "formSetArea"
            v-model="queryParams.setAreaValue"
            :label="queryParams.setAreaLabel"
            :show-all-levels="true"
            :props_="{multiple: false}"
            :options_="locationOptions"
            @change="data => {queryParams.setAreaValue = data.v}"
          ></hl-cascader>
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
            v-hasPermi="['project:fireequipment:add']"
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
            v-hasPermi="['project:fireequipment:edit']"
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
            v-hasPermi="['project:fireequipment:remove']"
          >删除
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="fireequipmentList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="设施类型" align="center" prop="equipmentCategoryIdDictLabel" show-overflow-tooltip/>
        <el-table-column label="生产厂家" align="center" prop="manufacturer" show-overflow-tooltip/>
        <el-table-column label="产品规格" align="center" prop="specification"/>
        <el-table-column label="设置数量" align="center" prop="setNumber"/>
        <el-table-column label="出厂日期" align="center" prop="productDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置区域" align="center" prop="setAreaLabel" />
        <el-table-column label="设置位置" align="center" prop="setLocation"/>
        <el-table-column label="技术参数" align="center" prop="technicalParameter" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['project:fireequipment:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['project:fireequipment:remove']"
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
    </div>

    <!-- 添加或修改消防设施对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="open">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设施类型" prop="equipmentCategoryId">
              <el-cascader
                :props="installationProps"
                v-model="form.equipmentCategoryId"
                @change="changeEquipmentType"
                :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-select
                clearable
                filterable
                v-model="form.manufacturer"
                @blur="manufacturerBlur"
                @change="manufacturerChange"
                placeholder="请输入生产厂家">
                <el-option v-for="o in manufacturerList"
                           :key="o.value"
                           :label="o.label"
                           :value="o.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specification">
              <el-select
                clearable
                filterable
                v-model="form.specification"
                @blur="specificationBlur"
                placeholder="请输入产品规格">
                <el-option v-for="o in specificationList"
                           :key="o.value"
                           :label="o.label"
                           :value="o.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设置数量" prop="setNumber">
              <el-input v-model="form.setNumber" placeholder="请输入设置数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置区域" prop="setAreaValue">
              <hl-cascader
                v-model="form.setAreaValue"
                :label="form.setAreaLabel"
                :show-all-levels="true"
                :props_="{multiple: true}"
                :options_="locationOptions"
                @change="changeSetArea"
                ></hl-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置位置" prop="setLocation">
              <el-input type="text" v-model="form.setLocation" placeholder="请输入设置区域"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期" prop="productDate">
              <el-date-picker clearable size="small"
                              v-model="form.productDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择出厂日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="技术参数" prop="technicalParameter">
              <el-input type="textarea" v-model="form.technicalParameter" placeholder="请输入技术参数"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="现场图片">
              <imageUpload v-model="form.imageUrl"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="formLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {arrTransStr, arrUnique} from '@/utils/arrayUtil'
import {mapState} from "vuex";
import {getDicts} from "@/api/system/dict/data";
import HlCascader from '@/components/HlCascader';
import ImageUpload from '@/components/ImageUpload';
import {listEquipment, getEquipment} from "@/api/project/equipment";
import {
  listFireequipment,
  getFireequipment,
  delFireequipment,
  addFireequipment,
  updateFireequipment,
  exportFireequipment,
  listPosition
} from "@/api/project/fireequipment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {isNotNull, stringTransArr} from "@/utils/stringUtil";
import {listAccfireproduct,addAccfireproduct} from "@/api/project/tfireproduct";
import log from "@/views/monitor/job/log";
let pid = '';
export default {
  name: "FireFacilities",
  components: {
    HlCascader,
    ImageUpload,
  },
  data() {
    return {
      manufacturerList: [],
      specificationList: [],
      // 遮罩层
      loading: true,
      formLoading: false,
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
      // 消防设施表格数据
      fireequipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentCategoryId: null,
        manufacturer: null,
        equipmentName: null,
        specification: null,
        setNumber: null,
        productDate: null,
        setLocation: null,
        setAreaValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipmentCategoryId: [
          {required: true, message: "设施类型不能为空", trigger: "change"}
        ],
        equipmentName: [
          {required: true, message: "设施名称不能为空", trigger: "blur"}
        ],
        /*manufacturer: [
          {required: true, message: "生产厂家不能为空", trigger: "blur"}
        ],
        specification: [
          {required: true, message: "产品型号", trigger: "blur"}
        ],
        setNumber: [
          {
            pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/,
            message: "请输入正确的数字",
            trigger: "blur"
          },
          {required: true, message: "设置数量", trigger: "blur"}
        ],
        setLocation: [
          {required: true, message: "设置位置", trigger: "blur"}
        ],
        setAreaValue: [
          {required: true, message: "设置区域不能为空", trigger: "blur"}
        ],*/
      },
      installationProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const {level} = node;
          if (level == 0) {
            console.log(level)
            let nodes = null;
            listEquipment({parentId: 0,type:'6'}).then(response => {
              nodes = response.data.map(item => ({
                value: String(item.equipmentId),
                label: item.name,
                children: item.children
              }))
              resolve(nodes)
            });
          }
          if (level == 1) {
            let nodes = null;
            listEquipment({parentId: node.data.value}).then(response => {
              nodes = response.data.map(item => ({
                value: String(item.equipmentId),
                label: item.name,
                children: item.children,
                leaf: true
              }))
              resolve(nodes)
            });
          }
        }
      },
      installationOptions: [],
      locationOptions: []
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapState({
      deptId: state => state.project.deptId
    })
  },
  mounted() {
    pid = this.deptId;
    this.getList();
    this.installationOptionList();
    this.getLocationOptions();
  },
  methods: {
    manufacturerBlur(e) {
      this.form.manufacturer = e.target.value;
    },
    manufacturerChange() {
      listAccfireproduct(
        {equipType:this.form.equipmentCategoryId[1],manufacturer:this.form.manufacturer,pageSize: 100}
      ).then(res => {
        this.specificationList = arrUnique(res.rows.map(item => ({
          value: item.specification,
          label: item.specification
        })),'label');
      })
    },
    specificationBlur(e) {
      this.form.specification = e.target.value;
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
    commaDictLabelFormatter(row, column) {
      let str;
      const ps = isNotNull(row[column.property]) ? row[column.property].split(",") : '';
      console.log(ps)
      for (let i = 0; i < ps.length; i++) {
        str += ","+ps[i].split("/")[1]
      }
      return str.substr(1);
    },
    installationOptionList(equipmentCategoryId) {
      this.installationOptions = [];
      if (equipmentCategoryId && equipmentCategoryId != '') {
        listEquipment({parentId: equipmentCategoryId}).then(res => {
          this.installationOptions = res.data;
        })
      }
    },
    getLocationOptions() {
      listPosition({deptId: this.deptId}).then(res => {
        this.locationOptions = arrUnique(res.data.map(item => ({
          value: String(item.type),
          label: '',
          type: item.type,
          leave: 0,
          children: []
        })),'value')
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
    /** 查询消防设施列表 */
    getList() {
      this.loading = true;
      this.queryParams.deptId = this.deptId;
      listFireequipment(this.queryParams).then(response => {
        this.fireequipmentList = response.rows;
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
        fireEquipmentId: null,
        deptId: null,
        useNature: null,
        equipmentCategoryId: null,
        manufacturer: null,
        equipmentName: null,
        specification: null,
        setNumber: null,
        productDate: null,
        setLocation: null,
        technicalParameter: null,
        setAreaValue: null,
        imageUrl: null,
        createBy: null,
        type: null,
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
      if (this.queryParams.equipmentCategoryId != null) {
        this.queryParams.equipmentCategoryId = this.queryParams.equipmentCategoryId[1]
      }
      if (this.queryParams.setAreaValue != null) {
        this.queryParams.setAreaValue = stringTransArr(this.queryParams.setAreaValue,',')[1]
      }
      console.log(this.queryParams.setAreaValue)
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.$refs.formSetArea.value = '';
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fireEquipmentId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "消防设施";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let self = this;
      const fireEquipmentId = row.fireEquipmentId || this.ids
      getFireequipment(fireEquipmentId).then(response => {
        self.form = response.data;
        getEquipment(self.form.equipmentCategoryId).then(res => {
          let arr = [];
          if (res.code == 200) {
            arr[0] = String(res.data.parentId);
            arr[1] = String(res.data.equipmentId);
          }
          self.form.equipmentCategoryId = arr;
          this.title = "消防设施";
          this.open = true;
        })
      });
    },
    transEquipment(equipmentCategoryId,separate) {

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.form.deptId = this.deptId
          this.form.useNature = this.form.equipmentCategoryId[this.form.equipmentCategoryId.length - 1];
          this.form.equipmentCategoryId = this.form.equipmentCategoryId[1];
          if (this.form.fireEquipmentId != null) {
            updateFireequipment(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.formLoading = false;
              this.getList();
            });
          } else {
            addFireequipment(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.formLoading = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fireEquipmentIds = row.fireEquipmentId || this.ids;
      this.$confirm('是否确认删除消防设施编号为"' + fireEquipmentIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delFireequipment(fireEquipmentIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有消防设施数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportFireequipment(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    changeEquipmentType() {
      this.manufacturerRemote();
      this.equipmentParams();
    },
    manufacturerRemote(){
      listAccfireproduct({
        equipType:this.form.equipmentCategoryId[1],pageSize: 100
      }).then(res => {
        this.manufacturerList = arrUnique(res.rows.map(item => ({
          value: item.manufacturer,
          label: item.manufacturer
        })),'label')
      })

    },
    equipmentParams() {
      let newVal = this.form.equipmentCategoryId;
      if (newVal && newVal.constructor.name=='Array') {
        let equipmentCategoryId = newVal[1];
        this.installationOptionList(Number(equipmentCategoryId));
        getEquipment(equipmentCategoryId).then(res => {
          this.form.technicalParameter = res.data.technicalData;
        })
      }
    }
  },
  watch: {
    'form.equipmentCategoryId'(newVal,oldVal) {
      this.changeEquipmentType();
      this.manufacturerChange()
    },
    'deptId'(newVal,oldVal) {
      pid = newVal
      this.getList();
      this.getLocationOptions()
    }
  }
};
</script>
