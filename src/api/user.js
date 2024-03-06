import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/acl/index/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/admin/acl/index/getUsers',
    method: 'get'
  })
}

export function getUserById(id) {
  return request({
    url: `/admin/acl/index/getUserById/${id}`,
    method: 'get'
  })
}
export function addUser(data) {
  return request({
    url: `/admin/acl/index/addUser`,
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: `/admin/acl/index/updateUser`,
    method: 'post',
    data
  })
}
export function removeUsers(ids) {
  return request({
    url: `/admin/acl/index/removeUsers`,
    method: 'delete',
    data: ids
  })
}

export function updateUserRoles(data) {
  return request({
    url: `/admin/acl/index/updateUserRoles`,
    method: 'post',
    data
  })
}
