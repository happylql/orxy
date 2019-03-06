const BASE_API = '/api/information';

export function fetchPlayerList(query) {
  return {
    url: `${BASE_API}/playerList`,
    method: 'get',
    params: query
  }
}

export function sealAccount(id) {
  const data = { id }
  return {
    url: `${BASE_API}/sealAccount`,
    method: 'post',
    data
  }
}

export function forbidChat(id) {
  const data = { id }
  return {
    url: `${BASE_API}/forbidChat`,
    method: 'post',
    data
  }
}
