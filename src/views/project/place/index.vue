<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="适用类别" prop="companyType">
        <treeselect v-model="queryParams.companyType" :options="companyOptions" :normalizer="normalizerCompany"
                    placeholder="请选择适用类别" size="small" style="width: 220px;"/>
      </el-form-item>
      <el-form-item label="是否公用" prop="isCommon">
        <hl-select v-model="queryParams.isCommon" dict-code="sys_yes_no" placeholder="请选择是否公用" clearable size="small"></hl-select>
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
          v-hasPermi="['project:place:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="placeList"
      row-key="placeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="部位场所描述" align="left" prop="name"/>
      <el-table-column label="是否公用" align="left" prop="isCommonDictLabel" width="100"/>
      <el-table-column label="适用类别" align="left" prop="companyTypeDictLabel"/>
      <el-table-column label="排序" align="left" prop="orderNum" width="100"/>
      <el-table-column label="等级" align="left" prop="level" width="100"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:place:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['project:place:add']"
            v-if="scope.row.level !== 1"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:place:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部位类别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父节点" prop="parentId">
          <treeselect v-model="form.parentId" :options="placeOptions" :normalizer="normalizer" placeholder="请选择父节点"
                      disabled="disabled"/>
        </el-form-item>
        <el-form-item label="部位场所描述" prop="name">
          <el-input v-model="form.name" placeholder="请输入部位场所描述"/>
        </el-form-item>
        <el-form-item label="是否公用" v-if="form.level !== 0">
          <el-radio-group v-model="form.isCommon">
            <el-radio
              v-for="dict in isCommonOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用类别" prop="companyType" v-if="form.isCommon === 'N'">
          <treeselect v-model="companyTypes" :options="companyOptions"
                      :value-consists-of="valueConsistsOf"
                      :multiple="true"
                      :normalizer="normalizerCompany" placeholder="请选择适用类别"/>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="请输入排序"/>
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
import {listPlace, getPlace, delPlace, addPlace, updatePlace, exportPlace} from "@/api/project/place";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeCompany} from "@/api/project/company";

export default {
  name: "Place",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 部位类别表格数据
      placeList: [],
      // 部位类别树选项
      placeOptions: [],
      companyOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否公用字典
      isCommonOptions: [],
      // 查询参数
      queryParams: {
        parentId: null,
        companyType: null,
        name: null,
        isCommon: null,
        orderNum: null,
        ancestors: null,
        state: null
      },
      // 表单参数
      form: {},
      companyTypes: [],
      valueConsistsOf: 'LEAF_PRIORITY',
      // 表单校验
      rules: {
        placeId: [
          {required: true, message: "部位场所不能为空", trigger: "blur"}
        ],
        parentId: [
          {required: true, message: "部位场所父节点id不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "部位场所描述不能为空", trigger: "blur"}
        ],
        isCommon: [
          {required: true, message: "是否公用不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.isCommonOptions = response.data;
    });

    this.getTreeCompany()
  },
  methods: {
    /** 查询部位类别列表 */
    getList() {
      this.loading = true;
      listPlace(this.queryParams).then(response => {
        this.placeList = this.handleTree(response.data, "placeId", "parentId");
        this.loading = false;
      });
    },
    /** 转换部位类别数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.placeId,
        label: node.name,
        children: node.children
      };
    },
    /** 转换部位类别数据结构 */
    normalizerCompany(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.companyId,
        label: node.keyName,
        children: node.children
      };
    },
    getTreeCompany() {
      this.companyOptions = [];
      //获取单位类别
      treeCompany().then(response => {
        this.companyOptions = response.data;
      });
    },
    /** 查询部位类别下拉树结构 */
    getTreeselect(row,addOrEdit) {
      this.placeOptions = [];
      //新增
      if (addOrEdit == 1){
        if (row != null && row.placeId) {
          getPlace(row.placeId).then(response => {
            const data = {placeId: response.data.placeId, name: response.data.name, children: []};
            this.placeOptions.push(data);
          });
        }else {
          const data = {placeId: 0, name: '重点部位', children: []};
          this.placeOptions.push(data);
        }

      }else if (addOrEdit == 2){
        if (row.parentId == 0) {
          const data = {placeId: 0, name: '重点部位', children: []};
          this.placeOptions.push(data);
        } else {
          getPlace(row.parentId).then(response => {
            const data = {placeId: response.data.placeId, name: response.data.name, children: []};
            this.placeOptions.push(data);
          });
        }
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        placeId: null,
        parentId: null,
        companyType: null,
        name: null,
        isCommon: "0",
        orderNum: null,
        ancestors: null,
        level: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        state: null
      };
      this.companyTypes = []
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
      this.getTreeselect(row,1);
      if (row != null && row.placeId) {
        this.form.parentId = row.placeId;
        this.form.level = row.level + 1;
      } else {
        this.form.parentId = 0;
        this.form.level = 0;
      }
      this.open = true;
      this.title = "添加部位类别";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect(row,2);
      if (row != null) {
        this.form.parentId = row.placeId;
      }
      getPlace(row.placeId).then(response => {
        this.form = response.data;
        if (response.data.companyType) {
          this.companyTypes = response.data.companyType.split(",")
        }
        this.open = true;
        this.title = "修改部位类别";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.companyType = this.companyTypes.join(',')
        console.log(this.form.companyType)
        if (valid) {
          if (this.form.placeId != null) {
            updatePlace(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlace(this.form).then(response => {
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
      this.$confirm('是否确认删除部位类别编号为"' + row.placeId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delPlace(row.placeId);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
