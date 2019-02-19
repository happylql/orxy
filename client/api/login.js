import request from '../utils/request'
import CryptoJs from 'crypto-js'

export function loginByUsername(username, password) {
  const data = {
    username: window.encodeURIComponent(username),
    password: CryptoJS.MD5(password).toString()
  }
  return request({
    url: '/user/signin',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/exit',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
