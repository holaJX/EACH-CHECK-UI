import request from '@/utils/request'

// 查询验收标准类型列表
export function listStandard(query) {
  return request({
    url: '/project/standardrule/list',
    method: 'get',
    params: query
  })
}
// 查询验收标准类型列表树
export function getTree(query) {
  return request({
    url: '/project/standardrule/tree',
    method: 'get',
    params: query
  })
}

// 查询验收标准类型详细
export function getStandard(standardId) {
  return request({
    url: '/project/standardrule/' + standardId,
    method: 'get'
  })
}

// 新增验收标准类型
export function addStandard(data) {
  return request({
    url: '/project/standardrule',
    method: 'post',
    data: data
  })
}

// 修改验收标准类型
export function updateStandard(data) {
  return request({
    url: '/project/standardrule',
    method: 'put',
    data: data
  })
}


// 导出验收标准类型
export function exportStandard(query) {
  return request({
    url: '/project/standard/export',
    method: 'get',
    params: query
  })
}
