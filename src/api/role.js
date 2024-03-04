import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/admin/acl/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/admin/acl/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/admin/acl/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/admin/acl/updateRole/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/admin/acl/deleteRole/${id}`,
    method: 'delete'
  })
}
export function deleteRoles(ids) {
  return request({
    url: `/admin/acl/deleteRoles`,
    method: 'delete',
    data: ids
  })
}
