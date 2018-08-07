const pkg = require('./package')
const bodyParser = require('body-parser')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'pigs',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'show pretty pigs' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: "https://fonts.googleapis.com/css?family=Open+Sans" }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/main.css'
  ],

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
      '~plugins/core-components.js',
      '~plugins/date-filter.js',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
  ],
  axios: {
    baseUrl:process.env.BASE_URL || process.env.API_KEY
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  //process.envはNode.jsのコマンドラインを取得する方法だった気がする
  //nuxt実行時にコマンドラインでbaseUrlを指定して起動みたいなことができるのかな。
  //envを使うときは、process.env.baseUrlで参照できるんだけど、この値ってクライアント実行時にも参照できるのかしら。
  env: {
    baseUrl: process.env.BASE_URL || 'https://nuxt-blog-fa11c.firebaseio.com',
    fbAPIKey: process.env.API_KEY 
  },
  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ],
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}
