import request from '@/utils/request'

export function removeMenu(data) {
  return request({
    url: '/admin/acl/removeMenu',
    method: 'delete',
    data
  })
}
export function addMenu(data) {
  return request({
    url: '/admin/acl/addMenu',
    method: 'post',
    data
  })
}
