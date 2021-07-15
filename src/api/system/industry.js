import request from '@/utils/request'

// 查询系统行业列表
export function listIndustry(query) {
  return request({
    url: '/system/industry/list',
    method: 'get',
    params: query
  })
}

// 查询系统行业详细
export function getIndustry(industryId) {
  return request({
    url: '/system/industry/' + industryId,
    method: 'get'
  })
}

// 新增系统行业
export function addIndustry(data) {
  return request({
    url: '/system/industry',
    method: 'post',
    data: data
  })
}

// 修改系统行业
export function updateIndustry(data) {
  return request({
    url: '/system/industry',
    method: 'put',
    data: data
  })
}

// 删除系统行业
export function delIndustry(industryId) {
  return request({
    url: '/system/industry/' + industryId,
    method: 'delete'
  })
}

// 导出系统行业
export function exportIndustry(query) {
  return request({
    url: '/system/industry/export',
    method: 'get',
    params: query
  })
}