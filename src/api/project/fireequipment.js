import request from '@/utils/request'

// 查询工程消防设施列表
export function listFireequipment(query) {
  return request({
    url: '/project/fireequipment/list',
    method: 'get',
    params: query
  })
}

// 查询工程消防设施详细
export function getFireequipment(fireEquipmentId) {
  return request({
    url: '/project/fireequipment/' + fireEquipmentId,
    method: 'get'
  })
}

// 新增工程消防设施
export function addFireequipment(data) {
  return request({
    url: '/project/fireequipment',
    method: 'post',
    data: data
  })
}

// 修改工程消防设施
export function updateFireequipment(data) {
  return request({
    url: '/project/fireequipment',
    method: 'put',
    data: data
  })
}

// 删除工程消防设施
export function delFireequipment(fireEquipmentId) {
  return request({
    url: '/project/fireequipment/' + fireEquipmentId,
    method: 'delete'
  })
}

// 导出工程消防设施
export function exportFireequipment(query) {
  return request({
    url: '/project/fireequipment/export',
    method: 'get',
    params: query
  })
}
// 设置位置列表
export function listPosition(query) {
  return request({
    url: '/project/fireequipment/listPosition',
    method: 'get',
    params: query
  })
}
