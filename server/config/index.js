export default {
  dbs: "mongodb://127.0.0.1:27017/gameManagerDev",
  redis: {
    get host() {
      return "127.0.0.1"
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return "smtp.qq.com"
    },
    get user() {
      return "771388996@qq.com"
    },
    get pass() {
      return "mifmzufuevxubaic"
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    get expire() {
      return () => {
        return parseInt(new Date().getTime()) + (60 * 1000);
      }
    }
  },
  sign: "a3c9fe0782107295ee9f1709edd15218", // 调用第三方服务需要的签名
  requestUrl: "http://cp-tools.cn" // 调用的第三方服务地址
}
