import CryptoJs from 'crypto-js'

const BASE_API = '/api';

export function loginByUsername(username, password) {
  const data = {
    username: window.encodeURIComponent(username),
    password: CryptoJS.MD5(password).toString()
  }
  return {
    url: `${BASE_API}/user/signin`,
    method: 'post',
    data
  }
}

export function logout() {
  return {
    url: `${BASE_API}/user/exit`,
    method: 'get'
  }
}

export function getUserInfo() {
  return {
    url: `${BASE_API}/user/info`,
    method: 'get'
  }
}
