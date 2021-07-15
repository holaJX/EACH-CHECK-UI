<template>
  <div>
    <div class="select-company-box">
      <div class="company-info">
        <div class="company-name">
          云南省烟草公司昆明市公司五华分公司
        </div>
        <div class="company-address">
          <i class="el-icon-location" style="color: #0061D4"></i>
          云南省/昆明市/安宁市
        </div>
      </div>
      <div class="company-btn">
        <el-button  @click="drawer = true" v-if="projectinfoList.length > 0">选择单位</el-button>
      </div>
    </div>
    <el-drawer
      title="工程项目"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      size="500px"
      class="drawer">
      <div class="drawer-container" v-loading="drawerLoading">
        <p class="drawer-title">选择单位</p>
        <div class="drawer-search">
          <el-input v-model="queryParams.deptName" placeholder="请输入单位名称"></el-input>
          <el-button type="primary" round>搜索</el-button>
        </div>
        <div class="drawer-content">
          <div class="drawer-card" v-for="item in projectinfoList" :key="item.deptId" @click="toSelect(item)">
            <div class="desc" v-bind:class="item.deptId == project.deptId ? 'activeClass' : 'noActiveClass' " >
              <div><span class="desc-label">单位名称：</span><span class="desc-value">{{ item.deptName }}</span></div>
              <div><span class="desc-label">单位地址：</span><span class="desc-value">{{ item.detailedAddressDictLabel }}</span></div>
              <div><span class="desc-label">行业类别：</span><span class="desc-value">{{ item.industryTypeDictLabel }}</span></div>
              <div><span class="desc-label">单位类型：</span><span class="desc-value">{{ item.deptTypeDictLabel }}</span></div>
              <div><span class="desc-label">消防监管单位：</span><span class="desc-value">{{ item.fireSupervise }}</span></div>
            </div>
          </div>
        </div>
      </div>
      <pagination
        class="pagination-wrapper"
        :hide-on-single-page="false"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        layout="prev, pager, next"
        @pagination="getList"
      />
    </el-drawer>
  </div>
</template>

<script>
  import {listSocialdept, socialDeptList} from "@/api/project/socialdept";
  export default {
    name: "index",
    data() {
      return {
        drawer: false,
        drawerLoading: false,
        direction: 'rtl',
        queryParams: {
          pageNum: 1,
          pageSize: 4,
        },
        projectinfoList: [],
        total: 0,
        project: ''
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        listSocialdept(this.queryParams).then(response => {
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
        socialDeptList(this.queryParams).then(response => {
          this.projectinfoList = response.rows;
          this.total = response.total;
          this.drawerLoading = false
        });
      },
      toSelect(val) {
        console.log(val)
        this.project = val
        this.$store.commit('SET_PROJECT_ID', this.project.deptId)
        this.drawer = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .select-company-box{
    width: 100%;
    height: 100px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    .company-info{
      .company-name{
        font-size: 18px;
        font-weight: bold;
        line-height: 40px;
        color: #000000;
      }
      .company-address{
        font-size: 16px;
        line-height: 31px;
        color: #000000;
      }
    }
    .company-btn{
      .el-button{
        width: 140px;
        height: 50px;
        background: linear-gradient(180deg, #09B1FB 0%, #016CD9 100%);
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        line-height: 30px;
        color: #FFFFFF;
      }
    }
  }
  .drawer-container {
    padding: 16px;
    background-color: white;
    .drawer-title {
      font-size: 18px;
      text-align: center;
      font-weight: bolder;
      color: #000000
    }
    .drawer-search{
      margin: 18px auto;
      width: 100%;
      display: flex;
      /deep/ .el-input{
        flex: 1;
        background-color: #F4F4F4;
        border-radius: 37px;
        margin-right: 20px;
        .el-input__inner{
          width: 100%;
          background-color: #F4F4F4;
          border-radius: 37px;
        }
      }
    }
    .drawer-content {
      font-size: 16px;
      .drawer-card {
        width: 100%;
        margin-bottom: 16px;
        background: #F3F4F5;
        border-radius: 10px;
        .desc {
          padding: 8px 15px;
          div {
            line-height: 26px;
          }
          .desc-label,.desc-value {
            font-size: 14px;
          }
          .desc-label {
            color: #999;
          }
        }
      }
    }
    .pagination-wrapper {
      right: 0px;
      /deep/ .el-pagination {
        margin: 0px auto;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
