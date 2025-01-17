import request from '@/utils/request'

export function cateSelectAll(pageNo, pageSize, category) {
  return request({
    url: `/pro/category/selectAll`,
    method: 'post',
    data: {
      current: pageNo,
      size: pageSize,
      category: category
    }
  })
}

export function cateCount() {
  return request({
    url: `/pro/category/count`,
    method: 'get'
  })
}
export function cateAdd(data) {
  return request({
    url: `/pro/category/add`,
    method: 'post',
    data
  })
}

export function cateUpdate(data) {
  return request({
    url: `/pro/category/update`,
    method: 'put',
    data
  })
}

export function cateDelete(data) {
  return request({
    url: `/pro/category/delete`,
    method: 'delete',
    data
  })
}

export function attrGroupSelectAll(pageNo, pageSize, attrGroup) {
  return request({
    url: `/pro/attrGroup/selectAll`,
    method: 'post',
    data: {
      current: pageNo,
      size: pageSize,
      attrGroup: attrGroup
    }
  })
}

export function attrGroupAdd(data) {
  return request({
    url: `/pro/attrGroup/insert`,
    method: 'post',
    data
  })
}

export function attrGroupUpdate(data) {
  return request({
    url: `/pro/attrGroup/update`,
    method: 'put',
    data
  })
}

export function attrGroupDelete(data) {
  return request({
    url: `/pro/attrGroup/delete`,
    method: 'delete',
    data
  })
}

export function attrSelectAll(pageNo, pageSize, attr) {
  return request({
    url: `/pro/attr/selectAll`,
    method: 'post',
    data: {
      page:{
        current: pageNo,
        size: pageSize,
      },
      data:attr
    }
  })
}

export function attrAdd(data) {
  return request({
    url: `/pro/attr/insert`,
    method: 'post',
    data
  })
}
export function getAttrByAttrGroupId(value) {
  return request({
    url: `/pro/attr/getByAttrGroupId?id=${value}`,
    method: 'get',
  
  })
}
export function attrUpdate(data) {
  return request({
    url: `/pro/attr/update`,
    method: 'put',
    data
  })
}

export function attrDelete(data) {
  return request({
    url: `/pro/attr/delete`,
    method: 'delete',
    data
  })
}

export function skuSelectAll(pageNo, pageSize, sku) {
  return request({
    url: `/pro/skuInfo/selectAll`,
    method: 'post',
    data: {
      page:{
        current: pageNo,
        size: pageSize,
      },
      data:sku
    }
  })
}

export function skuAdd(data) {
  return request({
    url: `/pro/skuInfo/insert`,
    method: 'post',
    data
  })
}

export function skuUpdate(data) {
  return request({
    url: `/pro/skuInfo/update`,
    method: 'put',
    data
  })
}

export function skuDelete(data) {
  return request({
    url: `/pro/skuInfo/delete`,
    method: 'delete',
    data
  })
}
