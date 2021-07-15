import request from '@/utils/request'

// 查询文档管理列表
export function listArchive(query) {
  return request({
    url: '/system/archive/list',
    method: 'get',
    params: query
  })
}

// 查询文档管理详细
export function getArchive(archiveId) {
  return request({
    url: '/system/archive/' + archiveId,
    method: 'get'
  })
}

// 新增文档管理
export function addArchive(data) {
  return request({
    url: '/system/archive',
    method: 'post',
    data: data
  })
}

// 修改文档管理
export function updateArchive(data) {
  return request({
    url: '/system/archive',
    method: 'put',
    data: data
  })
}

// 删除文档管理
export function delArchive(archiveId) {
  return request({
    url: '/system/archive/' + archiveId,
    method: 'delete'
  })
}

// 导出文档管理
export function exportArchive(query) {
  return request({
    url: '/system/archive/export',
    method: 'get',
    params: query
  })
}