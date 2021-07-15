import request from '@/utils/request'

// 查询部位类别列表
export function listPlace(query) {
  return request({
    url: '/project/place/list',
    method: 'get',
    params: query
  })
}

// 查询部位类别列表
export function treePlace(query) {
  return request({
    url: '/project/place/tree',
    method: 'get',
    params: query
  })
}


// 查询部位类别详细
export function getPlace(placeId) {
  return request({
    url: '/project/place/' + placeId,
    method: 'get'
  })
}

// 新增部位类别
export function addPlace(data) {
  return request({
    url: '/project/place',
    method: 'post',
    data: data
  })
}

// 修改部位类别
export function updatePlace(data) {
  return request({
    url: '/project/place',
    method: 'put',
    data: data
  })
}

// 删除部位类别
export function delPlace(placeId) {
  return request({
    url: '/project/place/' + placeId,
    method: 'delete'
  })
}

// 导出部位类别
export function exportPlace(query) {
  return request({
    url: '/project/place/export',
    method: 'get',
    params: query
  })
}
