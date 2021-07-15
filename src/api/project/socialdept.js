import request from '@/utils/request'

// 查询单位基本信息列表
export function listSocialdept(query) {
  return request({
    url: '/project/socialdept/list',
    method: 'get',
    params: query
  })
}

// 查询单位基本信息详细
export function getSocialdept(deptId) {
  return request({
    url: '/project/socialdept/' + deptId,
    method: 'get'
  })
}

// 新增单位基本信息
export function addSocialdept(data) {
  return request({
    url: '/project/socialdept',
    method: 'post',
    data: data
  })
}

// 修改单位基本信息
export function updateSocialdept(data) {
  return request({
    url: '/project/socialdept',
    method: 'put',
    data: data
  })
}

// 删除单位基本信息
export function delSocialdept(deptId) {
  return request({
    url: '/project/socialdept/' + deptId,
    method: 'delete'
  })
}

// 导出单位基本信息
export function exportSocialdept(query) {
  return request({
    url: '/project/socialdept/export',
    method: 'get',
    params: query
  })
}