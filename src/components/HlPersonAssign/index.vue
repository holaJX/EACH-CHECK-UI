<template>
  <treeselect
    ref="treeselectRef"
    :options="options"
    :multiple="true"
    v-model="tree_value"
    :value-consists-of="valueConsistsOf"
    :normalizer="normalizer"
    @deselect="handleDeSelect"
    @select="handSelectDepart"
    placeholder="选择成员"/>
</template>

<script>
import {findOrgUserTree} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "HlPersonAssign",
  components: {
    Treeselect
  },
  data() {
    return {
      tree_value: [],
      tree_lables: [],
      valueConsistsOf: 'LEAF_PRIORITY',
      options: "",
      normalizer(node) {
        //去掉children=null的属性
        if (node.children == null || node.children == 'null') {
          delete node.children;
        }
      },
    }
  },
  created() {
    this.findZNodes();
  },
  methods: {
    handSelectDepart(node, instanceId) {
      this.tree_lables.push(node.label);
      if (node.children) {
        let chids = node.children.map(item => item.id);
        this.tree_value.push(chids);
      } else {
        this.tree_value.push(node.id);
      }
      console.log('tree_value' + this.tree_value);
    },

    handleDeSelect(node, instanceId) {
      if (node.children) {
        let chids = node.children.map(item => item.id);
        for (let i = 0; i < chids.length; i++) {
          if (this.tree_value.indexOf(chids[i]) > -1) {
            this.tree_value.splice(this.tree_value.indexOf(chids[i]), 1);
            // console.log('deselect' + chids[i])
            // console.log('当前数组值：' + this.tree_value)
          }
        }
      } else {
        if (this.tree_value.indexOf(node.id) > -1) {
          this.tree_value.splice(this.tree_value.indexOf(node.id), 1);
          // console.log('deselect' + node.id)
          // console.log('当前数组值：' + this.tree_value)
        }
      }
    },
    //加载修改树结构json
    findZNodes: function () {
      findOrgUserTree().then(response => {
        this.options = response.data;
        console.log(this.options)
      })
    }
  },
  props: {
    ids: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
