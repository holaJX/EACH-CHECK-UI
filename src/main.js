import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // teach css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import '@/utils/stringUtil'
import '@/utils/arrayUtil'
import '@/enums/index' //添加枚举
import { getDicts,getTables } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import HlSelect from "@/components/HlSelect";
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
// 头部标签插件
import VueMeta from 'vue-meta'

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: ''  //  在此输入你自己的百度地图ak
})
//图片预览
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getTables = getTables
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.prototype.closeTab = function () {
  this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
  this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length-1].path)
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('HlSelect', HlSelect)

Vue.use(permission)
Vue.use(VueMeta)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

/** 接入高德地图 */
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
  key: '12463cfd17d8670f77a416ca8ba2352e',//个人key
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
