import request from '@/utils/request'

// 查询消防产品管理列表
export function listAccfireproduct(query) {
  return request({
    url: '/project/accfireproduct/list',
    method: 'get',
    params: query
  })
}

// 查询消防产品管理详细
export function getAccfireproduct(fireProductId) {
  return request({
    url: '/project/accfireproduct/' + fireProductId,
    method: 'get'
  })
}

// 新增消防产品管理
export function addAccfireproduct(data) {
  return request({
    url: '/project/accfireproduct',
    method: 'post',
    data: data
  })
}

// 修改消防产品管理
export function updateAccfireproduct(data) {
  return request({
    url: '/project/accfireproduct',
    method: 'put',
    data: data
  })
}

// 删除消防产品管理
export function delAccfireproduct(fireProductId) {
  return request({
    url: '/project/accfireproduct/' + fireProductId,
    method: 'delete'
  })
}

// 导出消防产品管理
export function exportAccfireproduct(query) {
  return request({
    url: '/project/accfireproduct/export',
    method: 'get',
    params: query
  })
}