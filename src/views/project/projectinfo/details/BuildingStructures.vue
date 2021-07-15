<template>
 <div class="app-container">
   <div>
     <el-tabs v-model="activeName">
       <el-tab-pane lazy label="单体建筑" name="single-build">
         <single-build></single-build>
       </el-tab-pane>
       <el-tab-pane lazy label="储罐" name="storage-tank">
         <storage-tank></storage-tank>
       </el-tab-pane>
       <el-tab-pane lazy label="堆场" name="stock-yard">
         <stock-yard></stock-yard>
       </el-tab-pane>
     </el-tabs>
   </div>
 </div>
</template>

<script>
import StockYard from "@/views/project/projectinfo/buildcards/StockYard";
import SingleBuild from "@/views/project/projectinfo/buildcards/SingleBuild";
import StorageTank from "@/views/project/projectinfo/buildcards/StorageTank";
export default {
  name: "BuildingStructures",
  components: {StockYard, StorageTank, SingleBuild},
  data() {
    return {
      activeName: 'single-build'
    }
  },
}
</script>

<style scoped>
.app-container {
  background-color: white;
}
</style>
