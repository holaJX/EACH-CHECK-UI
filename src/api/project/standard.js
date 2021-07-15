import request from '@/utils/request'

// 查询验收标准列表
export function listStandard(query) {
  return request({
    url: '/project/standard/list',
    method: 'get',
    params: query
  })
}

// 查询验收标准详细
export function getStandard(standardId) {
  return request({
    url: '/project/standard/' + standardId,
    method: 'get'
  })
}

// 新增验收标准
export function addStandard(data) {
  return request({
    url: '/project/standard',
    method: 'post',
    data: data
  })
}

// 修改验收标准
export function updateStandard(data) {
  return request({
    url: '/project/standard',
    method: 'put',
    data: data
  })
}

// 删除验收标准
export function delStandard(standardId) {
  return request({
    url: '/project/standard/' + standardId,
    method: 'delete'
  })
}

// 导出验收标准
export function exportStandard(query) {
  return request({
    url: '/project/standard/export',
    method: 'get',
    params: query
  })
}
