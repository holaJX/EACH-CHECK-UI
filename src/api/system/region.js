import request from '@/utils/request'

// 查询行政区划列表
export function listRegion(query) {
  return request({
    url: '/system/region/list',
    method: 'get',
    params: query
  })
}
// 查询行政区划列表
export function regionTree(query) {
  return request({
    url: '/system/region/regionTree',
    method: 'get',
    params: query
  })
}

// 查询行政区划详细
export function getRegion(id) {
  return request({
    url: '/system/region/' + id,
    method: 'get'
  })
}

// 新增行政区划
export function addRegion(data) {
  return request({
    url: '/system/region',
    method: 'post',
    data: data
  })
}

// 修改行政区划
export function updateRegion(data) {
  return request({
    url: '/system/region',
    method: 'put',
    data: data
  })
}

// 删除行政区划
export function delRegion(id) {
  return request({
    url: '/system/region/' + id,
    method: 'delete'
  })
}

// 导出行政区划
export function exportRegion(query) {
  return request({
    url: '/system/region/export',
    method: 'get',
    params: query
  })
}
