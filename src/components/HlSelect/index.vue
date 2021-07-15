<template>
  <el-select :getPopupContainer="getPopupContainer"
             :placeholder="placeholder"
             :disabled="disabled"
             :multiple="multiple"
             :value="getValueSting"
             :size="size"
             @change="handleInput">
    <el-option :value="undefined">请选择</el-option>
    <el-option v-for="item in dictOptions"
               :key="item.dictValue"
               :label="item.dictLabel"
               :value="item.dictValue">
    </el-option>
  </el-select>


</template>

<script>
export default {
  name: 'HlSelect',
  props: {
    dictCode: '',
    placeholder: '',
    size: '',
    triggerChange: Boolean,
    disabled: Boolean,
    multiple: Boolean,
    value: [String, Number, Array],
    type: String,
    getPopupContainer: {
      type: Function,
      default: (node) => node.parentNode
    }
  },
  data() {
    return {
      dictOptions: [],
      tagType: ""
    }
  },
  watch: {
    dictCode: {
      immediate: true,
      handler() {
        this.initDictData()
      },
    }
  },
  created() {
    if (!this.type || this.type === "list") {
      this.tagType = "select"
    } else {
      this.tagType = this.type
    }
  },
  computed: {
    getValueSting() {
      return this.value != null ? this.value : undefined;
    },
  },
  methods: {
    initDictData() {
      if (this.dictCode.indexOf(',') > -1) {
        this.getTables(this.dictCode).then(response => {
          this.dictOptions = response.data;
        });
      } else {
        this.getDicts(this.dictCode).then(response => {
          this.dictOptions = response.data;
        });
      }

    },
    handleInput(e) {
      let val = e
      if (this.triggerChange) {
        this.$emit('change', val);
      } else {
        this.$emit('input', val);
      }
    },
  }
}
</script>

<style scoped>

</style>
