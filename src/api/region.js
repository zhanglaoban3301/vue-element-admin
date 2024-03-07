import request from '@/utils/request'

export function getRegionByParentId(node) {
  return request({
    url: `/sys/region/getRegionByParentId?id=${node}`,
    method: 'get'
  })
}

export function getRegion(pageNo, pageSize) {
  return request({
    url: `/sys/region/getRegion?pageNo=${pageNo}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function getRegionCount() {
  return request({
    url: `/sys/region/getRegionCount`,
    method: 'get'
  })
}
