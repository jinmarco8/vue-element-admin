import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/vmware/login2/',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}

export function getInfo(token) {
  return request({
    url: '/vmware/userinfo/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
