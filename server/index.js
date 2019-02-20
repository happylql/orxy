import Koa from 'koa'
import consola from 'consola'
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import body from 'koa-body'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import serverConfig from './config'
import nuxtConfig from '../nuxt.config.js'
import Passport from './utils/passport'
import consts from './config/consts'
import KoaConnect from 'koa-connect'
import KoaCompress from 'koa-compress'
import compose from 'koa-compose'
import router from './router'

async function start() {
  const host = consts.HOST;
  const port = consts.PORT;
  const app = new Koa();

  app.keys = [`${consts.APP}-server`];
  app.proxy = true;

  app.use(async function subApp(ctx, next) {
    ctx.state.subapp = ctx.url.split('/')[1];
    await next();
  });

  // Import and Set Nuxt.js options
  nuxtConfig.dev = !(app.env === 'production');
  const nuxt = new Nuxt(nuxtConfig);
  // Build in development
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(session({
    key: consts.SESS_KEY,
    prefix: consts.SESS_PREFIX,
    store: new Redis()
  }));

  mongoose.connect(serverConfig.dbs, { useNewUrlParser: true });

  app.use(Passport.initialize());

  app.use(Passport.session());

  const nuxtRender = KoaConnect(nuxt.render);
  app.use(async (ctx, next) => {
    await next();
    if (ctx.state.subapp !== consts.API) {
      ctx.status = 200;
      ctx.req.session = ctx.session;
      await nuxtRender(ctx);
    }
  });

  app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')

    /**
     * In case you wanna see what you received from postRequest, or other endpoints.
     */
    const logRequestUrlResponse = '/api/user/login';
    const logApiAuthLogin = ctx.request.url === logRequestUrlResponse;
    if (logApiAuthLogin) {
      const debugObj = JSON.parse(JSON.stringify(ctx));
      const body = JSON.parse(JSON.stringify(ctx.body || null));
      const responseHeaders = JSON.parse(JSON.stringify(ctx.response.header));
      const requestHeaders = JSON.parse(JSON.stringify(ctx.request.header));
      console.log(`Received for ${logRequestUrlResponse}`, { ctx: debugObj, body, responseHeaders, requestHeaders });
    }
    const isApi = /^\/api\//.test(ctx.request.url);
    const logApi = false;
    if (isApi && logApi && !logApiAuthLogin) {
      const headers = Object.assign({}, JSON.parse(JSON.stringify(ctx.request.header)))
      console.log(`Request headers for ${ctx.url}`, headers)
    }
  });

  app.use(KoaCompress({}));

  // only search-index www subdomain
  app.use(async function robots(ctx, next) {
    await next()
    if (ctx.hostname.slice(0, 3) !== 'www') {
      ctx.response.set('X-Robots-Tag', 'noindex, nofollow')
    }
  })

  app.use(body());

  // sometimes useful to be able to track each request...
  app.use(async function (ctx, next) {
    await next()
  })

  // note no 'next' after composed subapp, this must be the last middleware
  app.use(async function composeSubapp(ctx, next) {
    switch (ctx.state.subapp) {
      case consts.API:
        await compose(router.middleware)(ctx)
        break
    }
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`,
    badge: true
  })
}

start()
