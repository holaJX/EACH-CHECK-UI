<template>
  <div style="display:flex;width:100%">
    <div style="height: 45px">
      <input type="text" v-model="address"><button @click="search">搜索</button>
    </div>
    <div id="result" class="amap_lib_placeSearch">
      <div class="amap_lib_placeSearch_list amap-pl-pc"  v-for="(item,index) in poiArr"
           @click="openMarkerTipById1(index,$event)"
           @mouseout="onmouseout_MarkerStyle(index+1,$event)"
           :key="index">
        <div class="poibox" style="border-bottom: 1px solid #eaeaea">
          <div class="amap_lib_placeSearch_poi poibox-icon" :class="index==selectedIndex?'selected':''">{{index+1}}</div>
          <div class="poi-img" v-if="item.url" :style="'background-image:url('+item.url+'?operate=merge&amp;w=90&amp;h=56&amp;position=5)'"
          ></div>
          <h3 class="poi-title" >
            <span class="poi-name">{{item.name}}</span>
          </h3>
          <div class="poi-info">
            <p class="poi-addr">地址：{{item.address}}</p>
            <p class="poi-tel">电话：{{item.tel}}</p>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div id="iCenter"></div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      map:'',//保存地址的经纬度
      address:'',//搜索的地区
      poiArr: [],//左边搜索出来的数组
      windowsArr: [],//信息窗口的数组
      marker: [],
      mapObj: "",//地图对象
      selectedIndex: -1
    };
  },
  mounted() {
    this.mapInit()
    this.address = this.addr;
    this.search();
    this.placeSearch("")
  },
  methods: {
    //创建一个map
    mapInit() {
      this.mapObj = new AMap.Map("iCenter", {
        resizeEnable: true
      })
    },
    //根据名字地址去搜索结果
    placeSearch(name) {
      var MSearch;
      this.mapObj.plugin(
        ["AMap.PlaceSearch", "AMap.ToolBar", "AMap.Scale"],
        () => {
          this.mapObj.addControl(new AMap.ToolBar())
          this.mapObj.addControl(new AMap.Scale())
          MSearch = new AMap.PlaceSearch({
            //构造地点查询类
            city: "" //城市
          });
          AMap.event.addListener(MSearch,"complete",this.keywordSearch_CallBack) //返回地点查询结果
          MSearch.search(name); //关键字查询
        }
      );
    },
    //结果的回调
    keywordSearch_CallBack(data) {
      var poiArr = data.poiList.pois
      var resultCount = poiArr.length
      this.poiArr = poiArr; //左边要渲染的数据
      for (var i = 0; i < resultCount; i++) {
        this.addmarker(i, poiArr[i])
        this.poiArr[i].url = this.poiArr[i].photos? this.poiArr[i].photos[0]? this.poiArr[i].photos[0].url: "": ""
      }
      this.mapObj.setFitView()
    },
    //添加marker&infowindow
    addmarker(i, d) {
      var lngX = d.location.getLng();
      var latY = d.location.getLat();
      var markerOption = {
        map: this.mapObj,
        position: new AMap.LngLat(lngX, latY)
      };
      var mar = new AMap.Marker(markerOption);
      this.marker.push(new AMap.LngLat(lngX, latY));
      var infoWindow = new AMap.InfoWindow({
        content:
          "<h3>" +
          d.name +
          "</h3>" +
          this.TipContents(d.name, d.address) +
          `</br><a  id="me"  href="javascript:;">保存地址</a>`,
        size: new AMap.Size(300, 0),
        autoMove: true,
        offset: new AMap.Pixel(0, -30)
      });
      this.windowsArr.push(infoWindow);
      var _this = this;
      var aa = (e) => {
        var obj = mar.getPosition();
        this.map = obj //这里保存的地址经纬度
        this.address = d.name //这里保存的是地址名字
        window.removeEventListener("click", _this.demo)
        infoWindow.open(_this.mapObj, obj);
        window.addEventListener("click", _this.demo)
      }
      AMap.event.addListener(mar, "click", aa)
    },
    TipContents(name, address) {

      //窗体内容
      if (
        name == "" ||
        name == "undefined" ||
        name == null ||
        name == " undefined" ||
        typeof name == "undefined"
      ) {
        type = "暂无";
      }
      if (
        address == "" ||
        address == "undefined" ||
        address == null ||
        address == " undefined" ||
        typeof address == "undefined"
      ) {
        address = "暂无";
      }
      var str = `地址：${address}`
      return str
    },
    demo(e) {
      if (e.target.id === `me`) {
        e.stopPropagation();
        this.saveAddress();
      }
    },
    saveAddress() {
      this.map.addr = this.address;
      this.$emit('map-info',this.map)
    },

    openMarkerTipById1(pointid, thiss) {
      //根据id 打开搜索结果点tip
      thiss.currentTarget.style.background = "#CAE1FF";
      this.selectedIndex = pointid
      this.map = this.marker[pointid]
      window.removeEventListener("click", this.demo);
      this.windowsArr[pointid].open(this.mapObj, this.marker[pointid])
      window.addEventListener("click", this.demo);
    },
    onmouseout_MarkerStyle(pointid, thiss) {
      //鼠标移开后点样式恢复
      thiss.currentTarget.style.background = ""
    },
    search() {
      this.mapObj=''
      this.mapInit()
      this.placeSearch(this.address)
    }
  },
  props: {
    addr: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
#iCenter {
  height: 678px;
  position: relative;
  display: flex;
  flex: 1;
}
#result {
  width: 210px;
  position: relative;
  height: 678px;
  overflow-y: scroll;
  border-right: 1px solid #ccc;
}
.amap_lib_placeSearch {
  height: 100%;
  overflow-y: scroll;
}
.amap_lib_placeSearch_page {
  position: absolute;
  bottom: 0;
  width: 100%;
}
#me {
  border-top: 1px solid #ccc;
  margin-top: 6px;
  padding-top: 6px;
  width: 100%;
  display: block;
}
.amap_lib_placeSearch .poibox {
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  padding: 5px 0 5px 10px;
  position: relative;
  min-height: 35px;
}
.amap_lib_placeSearch_poi {
  background: url(https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png)
  no-repeat;
  height: 31px;
  width: 19px;
  cursor: pointer;
  left: -1px;
  text-align: center;
  color: #fff;
  font: 12px arial, simsun, sans-serif;
  padding-top: 3px;
}
.amap_lib_placeSearch .poibox .poi-title {
  margin-left: 25px;
  font-size: 13px;
  overflow: hidden;
}
.amap_lib_placeSearch .amap_lib_placeSearch_poi {
  position: absolute;
}
.amap_lib_placeSearch .poibox .poi-info {
  word-break: break-all;
  margin: 0 0 0 25px;
  overflow: hidden;
}
.amap_lib_placeSearch .poibox .poi-info p {
  color: #999;
  font-family: Tahoma;
  line-height: 20px;
  font-size: 12px;
}
.amap_lib_placeSearch .poibox .poibox-icon {
  margin-left: 7px;
  margin-top: 4px;
}
.amap-pl-pc .poi-img {
  float: right;
  margin: 3px 8px 0;
  width: 90px;
  height: 56px;
  overflow: hidden;
}
.poibox {
  cursor: pointer;
}
.poibox:hover {
  background: #f6f6f6;
}
.selected {
  background-image: url(https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png) !important;
}
.amap-info-content {
  width: 200px !important;
}
</style>

