import request from '@/utils/request'

// 查询任务配置列表
export function listConfig(query) {
  return request({
    url: '/project/config/list',
    method: 'get',
    params: query
  })
}

// 查询任务配置详细
export function getConfig(scheduleId) {
  return request({
    url: '/project/config/' + scheduleId,
    method: 'get'
  })
}

// 新增任务配置
export function addConfig(data) {
  return request({
    url: '/project/config',
    method: 'post',
    data: data
  })
}

// 修改任务配置
export function updateConfig(data) {
  return request({
    url: '/project/config',
    method: 'put',
    data: data
  })
}

// 删除任务配置
export function delConfig(scheduleId) {
  return request({
    url: '/project/config/' + scheduleId,
    method: 'delete'
  })
}

// 导出任务配置
export function exportConfig(query) {
  return request({
    url: '/project/config/export',
    method: 'get',
    params: query
  })
}