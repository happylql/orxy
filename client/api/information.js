const BASE_API = '/api/information';

export function fetchPlayerList(query) {
  return {
    url: `${BASE_API}/playerList`,
    methods: 'get',
    params: query
  }
}
