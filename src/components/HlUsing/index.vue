<template>
  <div>
    <div>
      <el-input v-model="equipmentName">
        <el-button slot="append" icon="el-icon-search" @click="open = true"></el-button>
      </el-input>
    </div>
    <el-dialog :close-on-click-modal="false" title="使用性质" :visible.sync="open" width="80%" append-to-body >
      <el-row>
        <el-col :span="12">
          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="设施编号" prop="code">
              <el-input
                v-model="queryParams.code"
                placeholder="请输入消防设施编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="设施名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="消防设施编号" align="center" prop="code" />
            <el-table-column width="120" label="名称" align="center" prop="name" />
            <el-table-column label="排序" align="center" prop="orderNum" />
            <el-table-column label="等级" align="center" prop="level" />
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-col>
        <el-col :span="11" :offset="1">
          <el-table v-loading="childLoading" :data="categoryChildList" @selection-change="handleSelectEquipment" height="400px">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="消防设施编号" align="center" prop="code" />
            <el-table-column width="200" label="名称" align="left" prop="name" :show-overflow-tooltip="true"/>
            <el-table-column label="排序" align="center" prop="orderNum" />
            <el-table-column label="等级" align="center" prop="level" />
          </el-table>
          <pagination
            v-show="queryParam.total>0"
            :total="queryParam.total"
            :page.sync="queryParam.pageNum"
            :limit.sync="queryParam.pageSize"
            @pagination="getChildren"
          />
          <div style="font-size: 14px;margin-top: 15px">
            <span style="color: red">选择的设备：</span>{{equipmentName}}
          </div>
          <div>
            <el-button size="mini" type="primary" @click="ok" style="position: absolute;right: 15px">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getList,getEquipment } from "@/api/project/equipment";
export default {
  name: "index",
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      open: false,
      // 遮罩层
      loading: true,
      childLoading: false,
      //选择的消防设施
      equipmentName: '',
      // 建筑消防设施表格数据
      categoryList: [],
      //子节点
      categoryChildList: [],
      // 总条数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        code: null,
        name: null,
      },
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        total: 0
      },
      selectedEquipment: {}
    }
  },
  created() {
    this.initEquipment();
    this.getList();
  },
  methods: {
    initEquipment() {
      if (this.equipmentId && this.equipmentId != '') {
        getEquipment(this.equipmentId).then(response => {
          this.equipmentName = response.data.name
        })
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询建筑消防设施列表 */
    getList() {
      this.loading = true;
      this.queryParams.parentId = 0
      getList(this.queryParams).then(response => {
        this.categoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getChildren(parentId) {
      this.childLoading = true
      this.queryParam.parentId = parentId
      getList(this.queryParam).then(response => {
        this.categoryChildList = response.rows;
        this.queryParam.total = response.total;
        this.childLoading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.equipmentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
      this.getChildren(selection[0].equipmentId)
    },
    // 多选框选中数据
    handleSelectEquipment(selection) {
      this.selectedEquipment= selection[0];
      console.log(this.selectedEquipment)
    },
    ok() {
      this.equipmentName = this.selectedEquipment.name
      this.$emit("select-equip",this.selectedEquipment.equipmentId)
      this.open = false;
    }
  },
  props: {
    equipmentId: {
      type: Number,
      default: ''
    }
  }
}
</script>
