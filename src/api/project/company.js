import request from '@/utils/request'

// 查询单位类型列表
export function listCompany(query) {
  return request({
    url: '/project/company/list',
    method: 'get',
    params: query
  })
}

// 查询单位类型列表
export function treeCompany(query) {
  return request({
    url: '/project/company/tree',
    method: 'get',
    params: query
  })
}

// 查询单位类型详细
export function getCompany(companyId) {
  return request({
    url: '/project/company/' + companyId,
    method: 'get'
  })
}

// 新增单位类型
export function addCompany(data) {
  return request({
    url: '/project/company',
    method: 'post',
    data: data
  })
}

// 修改单位类型
export function updateCompany(data) {
  return request({
    url: '/project/company',
    method: 'put',
    data: data
  })
}

// 删除单位类型
export function delCompany(companyId) {
  return request({
    url: '/project/company/' + companyId,
    method: 'delete'
  })
}

// 导出单位类型
export function exportCompany(query) {
  return request({
    url: '/project/company/export',
    method: 'get',
    params: query
  })
}
