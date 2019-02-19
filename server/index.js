const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import serverConfig from './config'
import Passport from './utils/passport'
import user from './router/user'

const app = new Koa()
app.keys = ['gm', 'keyskeys'];
app.proxy = true;
app.use(session({
  key: 'gm',
  prefix: 'gm:uid',
  store: new Redis()
}));

app.use(bodyParser({ extendTypes: ['json', 'form', 'text'] }));
app.use(json());

mongoose.connect(serverConfig.dbs, { useNewUrlParser: true });

app.use(Passport.initialize());
app.use(Passport.session());

// Import and Set Nuxt.js options
let nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(nuxtConfig)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(user.routes()).use(user.allowedMethods());

  app.use(ctx => {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject);
      });
    });
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
