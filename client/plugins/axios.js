import { Message } from 'element-ui'

export default function ({ $axios, redirect }) {
  // 基本配置
  $axios.defaults.timeout = 15000;
  $axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  // 请求回调
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  // 返回回调
  $axios.onResponse(res => {
    // return Promise.resolve(response.data);
  })

  // 错误回调
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    switch (code) {
      case 400:
        //   redirect('/400')
        break;
      case 500:
        Message({
          message: '很遗憾，数据中心已与你失联，😭',
          type: 'error',
          duration: 5 * 1000
        })
        break;
      default:
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
    }

    console.log('[err]' + error) // for debug

    return Promise.reject(error);
  })
}
