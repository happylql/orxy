import CryptoJs from 'crypto-js'

export function loginByUsername(username, password) {
  const data = {
    username: window.encodeURIComponent(username),
    password: CryptoJS.MD5(password).toString()
  }
  return {
    url: '/user/signin',
    method: 'post',
    data
  }
}

export function logout() {
  return {
    url: '/user/exit',
    method: 'get'
  }
}

export function getUserInfo() {
  return {
    url: '/user/info',
    method: 'get'
  }
}
