import request from '@/utils/request'

// 查询资格证信息列表
export function listCertificate(query) {
  return request({
    url: '/system/certificate/list',
    method: 'get',
    params: query
  })
}

// 查询资格证信息详细
export function getCertificate(certificateId) {
  return request({
    url: '/system/certificate/' + certificateId,
    method: 'get'
  })
}

// 新增资格证信息
export function addCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'post',
    data: data
  })
}

// 修改资格证信息
export function updateCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'put',
    data: data
  })
}

// 删除资格证信息
export function delCertificate(certificateId) {
  return request({
    url: '/system/certificate/' + certificateId,
    method: 'delete'
  })
}

// 导出资格证信息
export function exportCertificate(query) {
  return request({
    url: '/system/certificate/export',
    method: 'get',
    params: query
  })
}