const pkg = require('./package')
const { resolve } = require('path')

module.exports = {
  mode: 'universal',
  srcDir: 'client/',
  buildDir: 'dist/client/',
  rootDir: './',
  dev: (process.env.NODE_ENV !== 'production'),

  /*
  ** Router config
  */
  router: {
    middleware: 'i18n'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
   ** Build configuration
   */
  build: {
    publicPath: '/orxy/',
    // transpile: [/^element-ui/],
    vendor: [
      'axios',
      'element-ui',
      'vue-i18n',
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [resolve(__dirname, 'client/assets/icons/svg')]

      // Includes /assets/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [resolve(__dirname, 'client/assets/icons/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        }
      })
    },
    extractCSS: true,
    filenames: {
      vendor: 'vendor.[hash:12].js',
      // app: 'orxy.[chunkhash:12].js',
      // css: 'orxy.[contenthash:12].css'
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'cyan' },

  /*
  ** Generate config
  */
  generate: {
    routes: ['/', '/login', '/en', '/en/login']
  },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    { src: '~/assets/styles/main.scss', lang: 'scss' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/element-ui',
    '~/plugins/svg-icon',
    {
      src: '~/plugins/axios',
      ssr: false
    },
    {
      src: '~/plugins/waves',
      ssr: false
    },
    {
      src: '~/plugins/filters.js',
      ssr: false
    },
    {
      src: '~/plugins/error-handler',
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // koa-proxies for dev, options reference https://github.com/nodejitsu/node-http-proxy#options
  development: {
    proxies: [
      /* {
        path: '/api/',
        target: 'http://localhost:3000/',
        logs: true,
        prependPath: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pages(\/|\/\w+)?$/, '/service')
      } */
    ]
  }
}
