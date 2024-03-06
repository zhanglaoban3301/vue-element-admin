import request from '@/utils/request'

export function getRegionByParentId(node) {
  return request({
    url: `/sys/region/getRegionByParentId/${node}`,
    method: 'get'
  })
}

export function getRegion() {
  return request({
    url: `/sys/region/getRegion`,
    method: 'get'
  })
}
