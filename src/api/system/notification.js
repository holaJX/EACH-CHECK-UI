import request from '@/utils/request'

// 查询消息通知列表
export function listNotification(query) {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params: query
  })
}

// 查询消息通知详细
export function getNotification(notificationId) {
  return request({
    url: '/system/notification/' + notificationId,
    method: 'get'
  })
}

// 新增消息通知
export function addNotification(data) {
  return request({
    url: '/system/notification',
    method: 'post',
    data: data
  })
}

// 修改消息通知
export function updateNotification(data) {
  return request({
    url: '/system/notification',
    method: 'put',
    data: data
  })
}

// 推送消息通知
export function pushNotification(notificationIds) {
  return request({
    url: '/system/notification/pushNotification/'+notificationIds,
    method: 'get'
  })
}
// 删除消息通知
export function delNotification(notificationId) {
  return request({
    url: '/system/notification/' + notificationId,
    method: 'delete'
  })
}

// 导出消息通知
export function exportNotification(query) {
  return request({
    url: '/system/notification/export',
    method: 'get',
    params: query
  })
}
