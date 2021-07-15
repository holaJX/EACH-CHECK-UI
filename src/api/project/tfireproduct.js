import request from '@/utils/request'

// 查询消防产品管理列表
export function listtfireproduct(query) {
  return request({
    url: '/project/tfireproduct/list',
    method: 'get',
    params: query
  })
}

// 查询消防产品管理详细
export function gettfireproduct(fireProductId) {
  return request({
    url: '/project/tfireproduct/' + fireProductId,
    method: 'get'
  })
}

// 新增消防产品管理
export function addtfireproduct(data) {
  return request({
    url: '/project/tfireproduct',
    method: 'post',
    data: data
  })
}

// 修改消防产品管理
export function updatetfireproduct(data) {
  return request({
    url: '/project/tfireproduct',
    method: 'put',
    data: data
  })
}

// 删除消防产品管理
export function deltfireproduct(fireProductId) {
  return request({
    url: '/project/tfireproduct/' + fireProductId,
    method: 'delete'
  })
}

// 导出消防产品管理
export function exporttfireproduct(query) {
  return request({
    url: '/project/tfireproduct/export',
    method: 'get',
    params: query
  })
}
