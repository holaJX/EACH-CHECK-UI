import request from '@/utils/request'

// 查询服务机构列表
export function listDeptService(query) {
  return request({
    url: '/project/deptService/list',
    method: 'get',
    params: query
  })
}

// 查询服务机构详细
export function getDeptService(deptId) {
  return request({
    url: '/project/deptService/' + deptId,
    method: 'get'
  })
}

// 新增服务机构
export function addDeptService(data) {
  return request({
    url: '/project/deptService',
    method: 'post',
    data: data
  })
}

// 修改服务机构
export function updateDeptService(data) {
  return request({
    url: '/project/deptService',
    method: 'put',
    data: data
  })
}

// 删除服务机构
export function delDeptService(deptId) {
  return request({
    url: '/project/deptService/' + deptId,
    method: 'delete'
  })
}

// 导出服务机构
export function exportDeptService(query) {
  return request({
    url: '/project/deptService/export',
    method: 'get',
    params: query
  })
}