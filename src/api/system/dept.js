import request from '@/utils/request'


export function socialDeptList(query) {
  return request({
    url: '/system/dept/socialDeptList',
    method: 'get',
    params: query
  })
}
// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

export function deptList(query) {
  return request({
    url: '/system/dept/deptList',
    method: 'get',
    params: query
  })
}


/**
 * 模糊搜索list查询
 * @param query
 * @returns {AxiosPromise}
 */
export function searchDept(query) {
  return request({
    url: '/system/dept/search',
    method: 'get',
    params: query
  })
}

// 查询部门列表
export function getTreeItems(query) {
  return request({
    url: '/system/dept/getTreeItems',
    method: 'get',
    params: query
  })
}

// 查询部门列表
export function getAllDeptByParentId(parentId) {
  return request({
    url: '/system/dept/allDeptByParentId?parentId='+parentId,
    method: 'get',
  })
}

// 查询组织结构下拉树
export function findOrgUserTree(query) {
  return request({
    url: '/system/dept/findOrgUserTree',
    method: 'get',
    params: query
  })
}

// 用户状态修改
export function changeDeptStatus(deptId, status) {
  const data = {
    deptId,
    status
  }
  return request({
    url: '/system/dept/changeStatus',
    method: 'put',
    data: data
  })
}


// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
