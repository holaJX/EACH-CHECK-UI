<template>
  <div class="app-container project-base-info">
    <el-row>
      <div class="container-top project-box-shadow">
        <div class="left" v-if="projectinfoList.length > 0">
          <span class="top">{{ project.deptName }}</span>
          <span class="bottom">
            <img class="image" src="@/assets/images/containerTop.svg">{{ project.districtCodeDictLabel }}
            <!--            <span-->
            <!--              v-if="activeCard == 'base-info' && operater != 'add' "-->
            <!--              class="hl-top-download-btn pointer"-->
            <!--              v-hasPermi="['project:projectinfo:export']" @click="petitionReport">-->
            <!--              <img src="@/assets/images/download.svg" width="20" height="20"/>验收申请表-->
            <!--            </span>-->
          </span>

        </div>
        <div class="null-project-left" v-else>
          <img src="@/assets/images/containerTopLeft.svg">
          <span style="position: absolute;top: 21px;color: #cccccc;left: 400px">暂无工程项目，请联系建设单位创建验收内容</span>
        </div>
        <div class="right">
          <el-button class="hl-btn" type="primary" @click="drawer=true" v-if="projectinfoList.length > 0">选择单位
          </el-button>
<!--          <el-button v-if="activeCard == 'base-info'" class="hl-btn" type="primary"-->
<!--                     v-hasPermi="['project:projectinfo:add']" @click="add">新增单位-->
<!--          </el-button>-->
        </div>
      </div>
    </el-row>
    <el-row v-if="openBase">
      <div class="hl-breadcrumb">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('base-info')">
            <a href="#" v-bind:class="activeCard=='base-info' ? 'is-active' : ''" class="breadcrumb-item">单位概况</a>
          </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('buildings-structures')">
            <a v-bind:class="activeCard=='buildings-structures' ? 'is-active' : ''" class="breadcrumb-item" href="#">建构(筑)物</a>
          </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('fire-facilities')">
            <a v-bind:class="activeCard=='fire-facilities' ? 'is-active' : ''" class="breadcrumb-item" href="#">消防设施</a>
          </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
          <span @click="breadcrumbItemClick('fire-service')">
            <a v-bind:class="activeCard=='fire-service' ? 'is-active' : ''" class="breadcrumb-item" href="#">服务机构</a>
          </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-card class="card" v-if="activeCard == 'base-info'">
          <base-card ref="baseInfo" :operater="operater" style="background-color: white"></base-card>
        </el-card>
        <el-card class="card" v-if="activeCard == 'buildings-structures'">
          <building-structures style="background-color: white" v-if="project.deptId != ''"></building-structures>
        </el-card>
        <el-card class="card" v-if="activeCard == 'fire-facilities'">
          <fire-facilities style="background-color: white" v-if="project.deptId != ''"></fire-facilities>
        </el-card>
        <el-card class="card" v-if="activeCard == 'fire-service'">
          <dept-service style="background-color: white" v-if="project.deptId != ''"></dept-service>
        </el-card>
      </div>
    </el-row>
    <el-drawer
      title="工程项目"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      size="423px"
      class="drawer"
      :before-close="handleClose">
      <div class="hl-drawer-container" v-loading="drawerLoading">
        <p class="drawer-title">请选择单位</p>
        <el-input placeholder="请输入选择条件" v-model="queryParams.deptName" clearable class="hl-drawer-search">
          <template slot="append" class="append">
            <el-button class="hl-btn" type="primary" @click="getList" size="small">搜索</el-button>
          </template>
        </el-input>
        <div class="hl-drawer-content">
          <el-card class="hl-drawer-card"
                   v-for="item in projectinfoList" :key="item.deptId"
                   shadow="hover">
            <div @click="edit(item)">
              <div class="desc" v-bind:class="item.deptId == project.deptId ? 'activeClass' : 'noActiveClass' ">
                <p><span class="desc-label">单位名称：</span><span class="desc-value">{{ item.deptName }}</span></p>
                <p><span class="desc-label">单位地址：</span><span class="desc-value">{{ item.districtCodeDictLabel}}</span></p>
<!--                <p><span class="desc-label">行业类别：</span><span class="desc-value">{{ item.industryTypeDictLabel }}</span>-->
<!--                </p>-->
<!--                <p><span class="desc-label">单位类型：</span><span class="desc-value">{{ item.deptTypeDictLabel }}</span></p>-->
<!--                <p><span class="desc-label">消防监管单位：</span><span class="desc-value">{{ item.fireSupervise }}</span></p>-->
              </div>
            </div>
          </el-card>
        </div>
        <pagination
          class="pagination-wrapper"
          :hide-on-single-page="false"
          v-show="total>3"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          layout="prev, pager, next"
          @pagination="getList"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload';
import BaseCard from "@/views/project/projectinfo/details/BaseCard";
import BuildingStructures from "@/views/project/projectinfo/details/BuildingStructures";
import FireFacilities from "@/views/project/projectinfo/details/FireFacilities";
 // import {listSocialdept} from "@/api/project/socialDeptList";
import DeptService from "./details/deptService";
 import {socialDeptList,deptList} from "@/api/system/dept";

export default {
  components: {DeptService, FireFacilities, BuildingStructures, BaseCard, ImageUpload},
  data() {
    return {
      total: 0,
      operater: 'add',
      project: {},
      drawer: false,
      drawerLoading: false,
      direction: 'rtl',
      activeCard: 'base-info',
      openBase: false,
      projectinfoList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 4,
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    add() {
      this.project = {};
      this.operater = 'add';
      this.openBase = true;
      this.activeCard = 'base-info';
      this.$store.commit('SET_PROJECT_ID', '')
    },
    edit(item) {
      console.log(item)
      this.project = item
      this.operater = 'edit'
      this.activeCard = 'base-info'
      this.$store.commit('SET_PROJECT_ID', this.project.deptId)
      this.drawer = false;
    },
    petitionReport() {
      petitionReport(this.project).then(res => {
        this.download(res.msg)
      })
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    initData() {
      this.queryParams.parentId=100;
      deptList(this.queryParams).then(response => {
        this.projectinfoList = response.rows;
        this.total = response.total;
        if (this.projectinfoList && this.projectinfoList.length > 0) {
          this.openBase = true;
          this.project = response.rows[0];
          this.operater = 'edit';
          this.$store.commit('SET_PROJECT_ID', String(this.project.deptId))
        }
      });
    },
    /** 查询基本信息列表 */
    getList() {
      this.drawerLoading = true
      this.queryParams.parentId=100;
      deptList(this.queryParams).then(response => {
        this.projectinfoList = response.rows;
        this.total = response.total;
        this.drawerLoading = false
      });
    },
    breadcrumbItemClick(str) {
      console.log(str)
      if (str == 'base-info') {
        this.activeCard = str
      } else {
        if (this.project.deptId && this.project.deptId != '') {
          this.activeCard = str
        }
      }
    },
    handleClose(done) {
      done();
    }
  }
};
</script>
<style lang="scss" scoped>
.container-top {
  background-color: white;
}

.el-card__body {
  padding: 0 !important;
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

