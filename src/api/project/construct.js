import request from '@/utils/request'

// 查询建（构）筑物列表
export function listConstruct(query) {
  return request({
    url: '/project/construct/list',
    method: 'get',
    params: query
  })
}

// 查询建（构）筑物详细
export function getConstruct(constructId) {
  return request({
    url: '/project/construct/' + constructId,
    method: 'get'
  })
}

// 新增建（构）筑物
export function addConstruct(data) {
  return request({
    url: '/project/construct',
    method: 'post',
    data: data
  })
}

// 修改建（构）筑物
export function updateConstruct(data) {
  return request({
    url: '/project/construct',
    method: 'put',
    data: data
  })
}

// 删除建（构）筑物
export function delConstruct(constructId) {
  return request({
    url: '/project/construct/' + constructId,
    method: 'delete'
  })
}

// 导出建（构）筑物
export function exportConstruct(query) {
  return request({
    url: '/project/construct/export',
    method: 'get',
    params: query
  })
}
