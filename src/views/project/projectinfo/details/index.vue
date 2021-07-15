<template>
  <div class="app-container">
    <el-row>
      <el-breadcrumb separator-class="el-icon-d-arrow-right" >
        <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('base-info')">
            <a href="#" v-bind:class="activeCard=='base-info' ? 'is-active' : ''" class="breadcrumb-item">工程项目</a>
          </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('buildings-structures')">
            <a v-bind:class="activeCard=='buildings-structures' ? 'is-active' : ''"  class="breadcrumb-item" href="#">建构(筑)物</a>
          </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('fire-facilities')">
            <a v-bind:class="activeCard=='fire-facilities' ? 'is-active' : ''" class="breadcrumb-item" href="#">消防设施</a>
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-card class="card" v-if="activeCard == 'base-info'">
        <base-card :project-id="deptId" @update-pid="pid => {deptId = pid}"></base-card>
      </el-card>
      <el-card class="card" v-if="activeCard == 'buildings-structures'">
        <building-structures :project-id="deptId"></building-structures>
      </el-card>
      <el-card class="card" v-if="activeCard == 'fire-facilities'">
        <fire-facilities :project-id="deptId"></fire-facilities>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import BaseCard from "@/views/project/projectinfo/details/BaseCard";
import BuildingStructures from "@/views/project/projectinfo/details/BuildingStructures";
import FireFacilities from "@/views/project/projectinfo/details/FireFacilities";
export default {
  components: {FireFacilities, BuildingStructures, BaseCard},
  data() {
    return {
      activeCard: 'base-info',
      deptId: ''
    };
  },
  created() {
    const deptId= this.$route.params && this.$route.params.deptId ;
    this.deptId = deptId ? deptId : ''
  },
  methods: {
    breadcrumbItemClick(str) {
      if (str == 'base-info') {
        this.activeCard = str
      } else {
        if (this.deptId && this.deptId != '') {
          this.activeCard = str
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
  border-radius: 0;
  box-shadow: none;
}
.breadcrumb-item {
  font-size: 16px;
}
.is-active {
  font-weight: bolder !important;
}
.el-breadcrumb__separator {
  color: blue !important;
}
</style>
