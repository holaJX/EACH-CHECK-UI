<template>
  <el-cascader
    clearable
    :props="{value: 'agencyId',label: 'name',checkStrictly: checkStrictly}"
    :options="regionOptions"
    :value="getValueSting"
    :size="size"
    :placeholder="placeholder"
    @change="handleChange"></el-cascader>
</template>

<script>
import {regionTree} from "@/api/system/region";
export default {
name: "HlRegion",
  data() {
    return {
      regionOptions: [],
    }
  },
  props: {
    triggerChange: Boolean,
    value: [String, Number, Array],
    size: '',
    placeholder: {
      type: String,
      default: ''
    },
    checkStrictly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getValueSting() {
      return this.value != null ? this.value.split(',').map(Number) : [];
    },
  },
  methods: {
    handleChange(value) {
      if (this.triggerChange) {
        this.$emit('change', value.join(','));
      } else {
        this.$emit('input', value.join(','));
      }
    },
    getTree() {
      regionTree({agencyId: 53}).then(res => {
        this.regionOptions = this.deleteNullChild(res.data);
      })
    },
    deleteNullChild(arr) {
      let childs = arr
      for (let i = childs.length; i--; i > 0) {
        if (childs[i].children) {
          if (childs[i].children.length) {
            this.deleteNullChild(childs[i].children)
          } else {
            delete childs[i].children
          }
        }
      }
      return arr
    }
  },
  mounted() {
    this.getTree();
  }
}
</script>

<style scoped>

</style>
