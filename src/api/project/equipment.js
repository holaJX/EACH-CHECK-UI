import request from '@/utils/request'

// 查询建筑消防设施列表
export function listEquipment(query) {
  return request({
    url: '/project/equipment/list',
    method: 'get',
    params: query
  })
}
// 查询建筑消防设施列表
export function getList(query) {
  return request({
    url: '/project/equipment/getList',
    method: 'get',
    params: query
  })
}

// 查询建筑消防设施详细
export function getEquipment(equipmentId) {
  return request({
    url: '/project/equipment/' + equipmentId,
    method: 'get'
  })
}

// 新增建筑消防设施
export function addEquipment(data) {
  return request({
    url: '/project/equipment',
    method: 'post',
    data: data
  })
}

// 修改建筑消防设施
export function updateEquipment(data) {
  return request({
    url: '/project/equipment',
    method: 'put',
    data: data
  })
}

// 查询验收标准类型列表树
export function getTree(query) {
  return request({
    url: '/project/equipment/tree',
    method: 'get',
    params: query
  })
}

// 删除建筑消防设施
export function delEquipment(equipmentId) {
  return request({
    url: '/project/equipment/' + equipmentId,
    method: 'delete'
  })
}

// 导出建筑消防设施
export function exportEquipment(query) {
  return request({
    url: '/project/equipment/export',
    method: 'get',
    params: query
  })
}
