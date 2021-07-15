<template>
  <div>
    <div class="map" id="container" :style="{height: height}"></div>
    <div class="dn-info-window">
      <div class="dn-info-name">{{projectInfo.name}}</div>
      <div class="dn-info-content">
        <div class="dn-info-top">
          <div class="dn-info-top-btn" :style="activeName == '1' ? {borderBottom: '2px solid orange'} : {}" @click="activeName = '1'">项目基本信息</div>
          <div class="dn-info-top-btn" :style="activeName == '2' ? {borderBottom: '2px solid orange'} : {}" @click="activeName = '2'">消防示教点评情况</div>
        </div>
        <div class="dn-info-msg">
          <div class="base-info" v-if="activeName == '1'">
            <div><span>工程地址：</span><span>{{projectInfo.addressDictLabel}}</span></div>
            <div><span>工程类别：</span><span>{{projectInfo.projectTypeDictLabel}}</span></div>
            <div><span>申请日期：</span><span>{{projectInfo.teachDate}}</span></div>
            <div><span>建设单位：</span><span>{{projectInfo.developmentOrganDictLabel}}</span></div>
            <div><span>项目负责：</span><span>{{projectInfo.developmentLeaderDictLabel}}</span></div>
            <div><span>服务机构：</span><span>{{projectInfo.serviceOrganDictLabel}}</span></div>
            <div><span>项目负责：</span><span>{{projectInfo.serviceLeaderDictLabel}}</span></div>
            <div><span>验收单位：</span><span>{{projectInfo.teachOrganDictLabel}}</span></div>
            <div><span>总建筑物面积：</span><span>{{projectInfo.grossArea}}&nbsp;m<sup>2</sup></span></div>
            <div><span>验收申请文号：</span><span>{{projectInfo.teachAcceptNum}}</span></div>
            <div><span>设计审查文号：</span><span>{{projectInfo.teachReviewNum}}</span></div>
            <div><span>特殊建设工程情形：</span><span>{{projectInfo.specialSituationDictLabel}}</span></div>
          </div>
          <div class="teach-info" v-if="activeName == '2'">
            <table width="100%">
              <tr style="font-weight: bolder;font-size: 14px">
                <td >分项工程</td>
                <td >验收内容</td>
                <td >验收结果</td>
              </tr>
              <tr v-for="(item,index) of tableData" >
                <td >{{ item.name }}</td>
                <td >{{ item.date }}</td>
                <td style="overflow: hidden">{{ item.address }}</td>
              </tr>
            </table>
            <pagination
              class="pagination-wrapper"
              :hide-on-single-page="false"
              v-show="total>3"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
let amapManager = new AMapManager()
import { mapList } from "@/api/project/projectinfo";
import {isNotNull} from "@/utils/stringUtil";
export default {
  name: 'HlMapMaker',
  props: {
    height: {
      type: String,
      default: '580px'
    }
  },
  data() {
    return {
      map: '',
      infoWindow: '',
      marker: '',
      timer: '',
      n: 0,
      list: [
        {
          name: '昆明市',
          longitude: '102.707262',
          latitude: '25.043635',
          people: Math.floor(Math.random() * 100000)
        },
      ],
      activeName: '1',
      tableData: [],
      projectInfo: {},
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 3
      }
    }
  },
  methods: {
   // 初始化地图控件方法
   initMap() {
     this.map = new AMap.Map(document.getElementById("container"), {
       mapStyle: 'amap://styles/7dd355b4b04f266d0dc8632849c2a408',
       resizeEnable: false,
       center: [this.list[0].longitude, this.list[0].latitude],//地图中心点
       zoom: 13,//地图显示的缩放级别
       keyboardEnable: false,
       zoomEnable: true,
       dragEnable: true,
       animateEnable: true
     });
     mapList().then(res => {
       this.list = res.data.map(item =>({
         ...item,
       }))
       // 循环初始化所有坐标点
       this.list.forEach(v => {
         if (isNotNull(v.latitude) && isNotNull(v.longitude)) {
           this.initMarker({ lng: v.longitude, lat: v.latitude }, v)
         }
       })
     })
     // 通过定时器对地图坐标进行轮播
     this.setInter()
   },
   // 初始化坐标点的icon
   initMarker(location, item) {
     // console.log('Location', location, item)
     // 生成坐标点icon
     let icon = new AMap.Icon({
       size: new AMap.Size(20, 26),
       image: require("@/assets/images/map_01.svg"),
       imageSize: new AMap.Size(20, 26)
     });
     // 坐标点 生成方法
     this.marker = new AMap.Marker({
       icon: icon, // 坐标点图标
       position: [location.lng, location.lat], // 左边点的经纬度
       offset: new AMap.Pixel(0, -30) // 坐标点偏移量
     });
     // 坐标点添加点击事件 用来打开自定义窗口 也可直接添加窗口自动全部打开状态
     this.marker.on('click', (e) => {
       // console.log('marker 添加点击事件：', e, e.pixel.x, e.pixel.y)
       this.initInfoWindow(location.lng, location.lat, item)
       // 点击当前标点移动至地图中心点
       this.setCenter(location.lng, location.lat)
       this.infoWindow.open(this.map, e.lnglat)
     })
     // 初始化坐标点自定义窗口
     this.initInfoWindow(location.lng, location.lat, item)
     // 打开窗口的方法 这里也可以通过 点击坐标点打开
     this.infoWindow.open(this.map, {Q: location.lat, R: location.lng, lat: location.lat, lng: location.lng})
     //
     this.marker.setMap(this.map)
   },
   // 初始化信息窗体
   initInfoWindow(lng, lat, item) {
     // console.log('创建了信息窗体')
     this.infoWindow = new AMap.InfoWindow({
       isCustom: true,  //使用自定义窗体
       anchor: 'bottom-center',
       content: this.createInfoWindow(item),
       offset: new AMap.Pixel(0, -20),
       autoMove: true,
       closeWhenClickMap: false
     });
   },

   // 创建信息窗体
   createInfoWindow(item) {
     this.projectInfo = item;
     console.log(item)
     return `<div style="padding: 15px;font-size:12px;background-color: rgba(0,0,0,.5);color: white">
                <div style="line-height: 12px">项目名称：${item.name}</div>
             </div>`
   },
   handleClick(tab, event) {
    console.log(tab, event);
   },
   // 轮循坐标点方法
   setInter() {
     this.timer = setInterval(() => {
       // 轮播当前标点移动至地图中心点
       this.setCenter(this.list[this.n].longitude, this.list[this.n].latitude)
       this.initMarker({ lng: this.list[this.n].longitude, lat: this.list[this.n].latitude }, this.list[this.n])
       if (this.n == (this.list.length - 1)) {
         this.n = 0
       } else {
         this.n++
       }
     }, 10000)
   },
   // 当前标点移动至地图中心
   setCenter (long, lati) {
     this.map.setCenter([long, lati])
   },
 },
  mounted () {
    this.initMap();
  },
  beforeDestroy () {
    clearInterval(this.timer)
 }
}
</script>

<style lang="scss" scoped>
.dn-info-window {
  width: 600px;height: 330px;background-color: rgba(0,0,0,.5);padding: 15px;position: absolute;top: 100px;right: 80px;
  .dn-info-name {
    color: white;text-align: left;font-size:14px;height: 24px;line-height: 24px;display: block;margin-bottom: 15px;
  }
  .dn-info-content {
    display: block;height: 260px;border: 1px solid white;
    .dn-info-top {
      display: flex;justify-content: center;border-bottom: 1px solid white;
      .dn-info-top-btn {
        height: 28px;line-height: 28px;font-size:12px;text-align: center;color: white;width: 50%
      }
    }
    .dn-info-msg {
      width: 100%;height: 230px;color: white;padding: 15px;font-weight: lighter;
      .teach-info {
        table {
          tr {
            td {
              text-align: center;
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              padding-bottom: 6px;
              border-bottom: 1px solid white;
            }
          }
        }
      }
    }
  }
}
.pagination-wrapper {
  right: 0px;
  background-color: rgba(0,0,0,0);
  .el-pagination {
    margin: 0px auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
