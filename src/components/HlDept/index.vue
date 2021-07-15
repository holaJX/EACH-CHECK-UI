<template>
  <div :props="{deptId: 'deptId',deptName: 'deptName'}">
    <el-input readonly v-model="name">
      <el-button slot="append" icon="el-icon-search" @click="open = true"></el-button>
    </el-input>
    <el-dialog :close-on-click-modal="false" title="选择部门" :visible.sync="open" width="400px" append-to-body>
      <el-tree
        :data="deptOptions"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
        accordion
        @node-click="handleNodeClick"
      />
    </el-dialog>
  </div>

</template>

<script>
import {treeselect,getDept} from "@/api/system/dept";

export default {
  name: 'HlDept',
  props: {
    deptId: {
      type: [Number,String],
      default: ''
    },
    deptName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      name: '',
      open: false,
      // 遮罩层
      loading: true,
      childLoading: false,
      deptOptions: [],
      selectedDept: {}
    }
  },
  mounted() {
    this.getDept()
    this.getTreeSelect();
  },
  watch: {
    'deptId': function (n,o) {
      this.getDept();
      this.getTreeSelect();
    }
  },
  methods: {
    getDept() {
      if (this.deptId && this.deptId != '') {
        getDept(this.deptId).then(res => {
          this.name = res.data.deptName
        })
      }
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label && data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.name = data.label;
      this.$emit("select-dept",data.id)
      this.open = false;
    }
  },
}
</script>
