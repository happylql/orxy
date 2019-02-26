import CryptoJs from 'crypto-js'

const BASE_API = '/api/user';

export function loginByUsername(username, password) {
  const data = {
    username: window.encodeURIComponent(username),
    // password: CryptoJS.MD5(password).toString(),
    password: password
  }
  return {
    url: `${BASE_API}/signin`,
    method: 'post',
    data
  }
}

export function logout() {
  return {
    url: `${BASE_API}/exit`,
    method: 'get'
  }
}

export function getUserInfo() {
  return {
    url: `${BASE_API}/info`,
    method: 'get'
  }
}

export function register(username, password, email, code) {
  const data = {
    username: window.encodeURIComponent(username),
    password: CryptoJS.MD5(password).toString(),
    email,
    code
  }
  return {
    url: `${BASE_API}/signup`,
    method: 'post',
    data
  }
}

export function sendCode(username, email) {
  return {
    url: `${BASE_API}/verify`,
    method: 'post',
    data
  }
}
