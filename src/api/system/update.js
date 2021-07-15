import request from '@/utils/request'

// 查询应用更新列表
export function listUpdate(query) {
  return request({
    url: '/system/update/list',
    method: 'get',
    params: query
  })
}

// 查询应用更新详细
export function getUpdate(updateId) {
  return request({
    url: '/system/update/' + updateId,
    method: 'get'
  })
}

// 新增应用更新
export function addUpdate(data) {
  return request({
    url: '/system/update',
    method: 'post',
    data: data
  })
}

// 修改应用更新
export function updateUpdate(data) {
  return request({
    url: '/system/update',
    method: 'put',
    data: data
  })
}

// 删除应用更新
export function delUpdate(updateId) {
  return request({
    url: '/system/update/' + updateId,
    method: 'delete'
  })
}

// 导出应用更新
export function exportUpdate(query) {
  return request({
    url: '/system/update/export',
    method: 'get',
    params: query
  })
}