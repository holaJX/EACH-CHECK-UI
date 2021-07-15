<template>
  <div>
    <el-cascader
      ref="cascader"
      v-model="arr"
      :options="options_"
      :show-all-levels="showAllLevels"
      :props="props_"
      @change="change"></el-cascader>
  </div>
</template>

<script>
import {stringTransArr} from "@/utils/stringUtil";
import {arrTransStr} from "@/utils/arrayUtil";

export default {
  name: "index",
  props: {
    showAllLevels: {},
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    options_: {
      type: Array,
      default: []
    },
    props_: {
      muliple: {
        type: Boolean,
        default: false
      }
    },
  },
  data() {
    return {
      arr: []
    }
  },
  created() {
    if (this.value && this.value != null) {
      let list = this.value.split(',');
      for(let i= 0;i<list.length-1;i+=2) {
        let item = [list[i],list[i+1]];
        this.arr.push(item)
      }
    }
  },
  methods: {
    change() {
      let data = [];
      let valueStr = '';
      let labelStr = '';
      this.$refs['cascader'].getCheckedNodes().forEach(item => {
        if (arrTransStr(item.path,',').indexOf(',') > 0) {
            valueStr += arrTransStr(item.path,',') + ',';
            labelStr += arrTransStr(item.pathLabels,'/') + ',';
        }
      })
      valueStr = valueStr.slice(0,valueStr.length-1)
      labelStr = labelStr.slice(0,labelStr.length-1)
      this.$emit('change',{'v': valueStr,'l': labelStr})
    },
    arrUnique(arr, key) {
      let returnArr = [];
      if (key) {
        // 对象数组去重
        const obj = {};
        returnArr = arr.reduce((cur, next) => {
          obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next);
          return cur;
        }, []);
        return returnArr;
      }
      // 普通数组去重
      returnArr = arr.reduce((cur, next) => {
        !cur.includes(next) && cur.push(next);
        return cur;
      }, []);
      return returnArr;
    }
  },
}
</script>

<style scoped>

</style>
