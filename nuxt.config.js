export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '华北航线车辆运营管理系统',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/icons',
    '@/plugins/axios',
    '@/plugins/permission',
    '@/plugins/baidu-map',
    '@/plugins/vue-timers'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [

  ],
  static: {
    preffix: '/test/'
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.baseURL || 'http://localhost:50003',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) { },
    analyze: false,
    splitChunks: {
      layouts: false,
      pages: false,
      commons: true
    }
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'data.access_token',
          required: true,
          global: true,
          name: 'Authorization',
          type: 'Bearer',
          maxAge: 1800
        },
        user: {
          property: 'data',
          required: false,
        },
        endpoints: {
          login: { url: '/api/v1/auth/token', method: 'post' },
          user: { url: '/api/v1/users/current', method: 'get' },
          logout: { url: '/api/v1/auth/logout', method: 'get' },
        }
      }
    }
  },
  router: {
    mode: 'hash',
    middleware: ['auth'],
    base: process.env.NODE_ENV === 'production' ? '/dache' : '',
  },
  env: {
    staticPrefix: process.env.NODE_ENV === 'production' ? '/dache' : ''
  }
}
