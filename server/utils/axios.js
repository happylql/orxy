const axios = require('axios')

const service = axios.create({
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  timeout: 10000
})

module.exports = service;
