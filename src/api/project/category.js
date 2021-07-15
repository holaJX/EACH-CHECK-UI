import request from '@/utils/request'

// 查询单位类型列表
export function listCategory(query) {
  return request({
    url: '/project/category/list',
    method: 'get',
    params: query
  })
}

// 查询单位类型详细
export function getCategory(companyId) {
  return request({
    url: '/project/category/' + companyId,
    method: 'get'
  })
}

// 新增单位类型
export function addCategory(data) {
  return request({
    url: '/project/category',
    method: 'post',
    data: data
  })
}

// 修改单位类型
export function updateCategory(data) {
  return request({
    url: '/project/category',
    method: 'put',
    data: data
  })
}

// 删除单位类型
export function delCategory(companyId) {
  return request({
    url: '/project/category/' + companyId,
    method: 'delete'
  })
}

// 导出单位类型
export function exportCategory(query) {
  return request({
    url: '/project/category/export',
    method: 'get',
    params: query
  })
}