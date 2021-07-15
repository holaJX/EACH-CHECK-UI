<template>
  <div class="app-container home">
    <SelectCompany></SelectCompany>
    <div class="home-content">
      <el-row class="home-top" :gutter="10">
        <el-col :span="18">
          <div class="content-box">
            <div class="home-header">
              <div class="header-icon"></div>
              消防安全隐患
            </div>
            <div class="content-main">
              <el-table
                :data="tableData"
                stripe

                style="width: 100%;">
                <el-table-column
                  prop="type"
                  label="隐患类型"
                  sortable
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="question"
                  label="隐患问题"
                  show-overflow-tooltip
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="area"
                  align="center"
                  sortable
                  show-overflow-tooltip
                  label="隐患部位">
                </el-table-column>
                <el-table-column
                  prop="date"
                  align="center"
                  sortable
                  label="发现时间">
                </el-table-column>
                <el-table-column
                  prop="state"
                  align="center"
                  sortable
                  label="整改状态">
                </el-table-column>
              </el-table>
              <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="100">
              </el-pagination>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="d-flex flex-column">
          <div class="home-left" style="margin-bottom: 14px">
            <div class="content-box">
              <div class="home-header">
                <div class="header-icon"></div>
                检查执行率
              </div>
              <div class="content-main">
                <img src="../../../assets/images/home-test1.png" alt="">
              </div>
            </div>
          </div>
          <div class="home-left">
            <div class="content-box">
              <div class="home-header">
                <div class="header-icon"></div>
                整改完成率
              </div>
              <div class="content-main">
                <img src="../../../assets/images/home-test2.png" alt="">
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="home-bottom" :gutter="10">
        <el-col :span="18">
          <div class="content-box">
            <div class="home-header">
              <div class="header-icon"></div>
              消防安全态势
            </div>
            <div class="content-main" ref="situationChart">
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="content-box">
            <div class="home-header flex-justify-between">
              <div class="d-flex flex-justify-between">
                <div class="header-icon"></div>
                <div>消息通知</div>
              </div>
              <div class="mr20" style="font-weight: 100;color: #999999">待查收 <span style="color: #0061D4">2</span> 条</div>
            </div>
            <div class="content-main d-flex flex-column flex-justify-between" style="border-top: 1px solid #E6E6E6; padding-top: 20px">
              <div>
                <div class="d-flex flex-justify-between mb10">
                  <div>系统通知</div>
                  <div>2020-12-31 13:54</div>
                </div>
                <div style="overflow: auto; max-height: 140px">
                  云南省社会单位消防安全检查示教系统自2021年3月15日起正式启用，请各单位消防安全管理人在本周内完善单位基本信息，根据工作需要注册分配本单位其他用户账号。
                </div>
              </div>
              <el-pagination
                small
                class="pagination"
                background
                layout="prev, pager, next"
                :total="60"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SelectCompany from '@/components/common/SelectCompany/index.vue'
export default {
  name: "index",
  components: { SelectCompany },
  data() {
    return {
      tableData: [{
        type: '消防日常管理',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待安排'
      },
      {
        type: '建筑消防设施',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '未整改'
      },
      {
        type: '建筑防火安全',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待确认'
      },
      {
        type: '火灾危险源概况',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待确认'
      },
      {
        type: '消防日常管理',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待安排'
      },
      {
        type: '建筑消防设施',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '未整改'
      },
      {
        type: '建筑防火安全',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待确认'
      },
      {
        type: '火灾危险源概况',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待确认'
      },
      {
        type: '消防日常管理',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待安排'
      },
      {
        type: '消防日常管理',
        question: '消防控制室所有值班人员没有按管理要求持证上岗',
        date: '2021/12/31 09:26',
        area: '商务办公楼/消防控制室',
        state: '待安排'
      }]
    };
  },
  mounted() {
    this.getSituationChart()
  },
  methods: {
    getSituationChart() {
      let _this = this
      this.salesRatio = this.$echarts.init(this.$refs.situationChart);
      this.salesRatio.setOption( {
        color: ['#FE9B07', '#0061D4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['发现隐患', '消除隐患'],
          left: 'right'
        },
        grid: {
          top: '12%',
          left: '0',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              //网格线
              lineStyle: {
                type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
            }
          }
        ],
        series: [
          {
            name: '发现隐患',
            type: 'line',
            stack: '发现隐患',
            areaStyle: {
              color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#F9D49C'
              }, {
                offset: 1,
                color: '#FFFFFF'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330]
          },
          {
            name: '消除隐患',
            type: 'line',
            stack: '消除隐患',
            areaStyle: {
              color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#84B6F2'
              }, {
                offset: 1,
                color: '#FFFFFF'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 110,120, 132, 101, 134, 90]
          }
        ]
      })
    }
  },
};
</script>

<style scoped lang="scss">
  .app-container{
    background-color: #F3F4F5;
    padding: 0;
  }

  .home-content{
    .el-col{
      height: 100%;
    }
    .home-top{
      height: 636px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .home-bottom{
      height: 312px;
    }
    .home-left{
      flex: 1;
    }
    img{
      width: 190px;
      height: 190px;
      display: block;
      margin: 20px auto;
    }
    .content-box{
      background-color: #FFFFFF;
      height: 100%;
      width: 100%;
      .home-header{
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        font-weight: bold;
        color: #333333;
        display: flex;
        .header-icon{
          width: 6px;
          height: 18px;
          background: #0061D4;
          border-radius: 5px;
          margin-top: 15px;
          margin-right: 16px;
        }
      }
      .content-main{
        width: 100%;
        padding: 0 30px;
        font-size: 14px;
        color: #000000;
        height: calc(100% - 60px);
        .pagination{
          margin: 20px auto;
          text-align: center;
        }
      }
    }
  }
</style>

