const APP = 'oryx';
const API = 'api';
const BASE_API = `/${API}`;
const SESS_KEY = 'oryx:sess';
const SESS_PREFIX = 'oryx:uid';
const COOKIE_JMT = 'oryx_jwt';
const AXIOS_DEFAULT_TIMEOUT = 50000;
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '3000';
const LB_ADDR = process.env.LB_ADDR || `http://${HOST}:${PORT}/${API}`;

export default Object.freeze({
  APP,
  API,
  BASE_API,
  SESS_KEY,
  SESS_PREFIX,
  COOKIE_JMT,
  AXIOS_DEFAULT_TIMEOUT,
  HOST,
  PORT,
  LB_ADDR
})
