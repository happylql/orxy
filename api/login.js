import request from '../utils/request'
import CryptoJs from 'crypto-js'

export function loginByUsername(username, password) {
  const data = {
    username,
    password: CryptoJS.MD5(password).toString()
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
