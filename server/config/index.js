let isDev = process.env.NODE_ENV === 'development';
let config = isDev ? require('./dev.conf.js') : (require('./prod.conf.js'));
module.exports = config;
