export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'en',
      'data-n-head': 'lang'
    },
    title: 'Dashboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content: `SenexPay is the easiest and most reliable platform to exchange cryptocurrency. We are building Africa's biggest cross-border payments infrastructure.`
      },
      {
        name: 'keywords',
        content:
          'bitcoin, exchange, trade, btc, sell, buy, nigeria, sell bitcoin, buy bitcoin, otc, buy bitcoins in nigeria, sell bitcoins in nigeria, fast, secure, reliable, senex, senexpay, senex payment services, money, credit card, debit card, payment, buy bitcoin with card, blockchain, network, block, hash, confirmations, KYC, 24/7 exchange, currency exchange, crypto exchange, senex services payment'
      },
      { name: 'theme-color', content: '#053888' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'SenexPay | Buy & Sell Bitcoin and USDT securely.'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/img/senexpay-og-image.png'
      },
      {
        property: 'og:image:width',
        content: '740'
      },
      {
        property: 'og:image:height',
        content: '300'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: `SenexPay is the easiest and most reliable platform to exchange cryptocurrency. We are building Africa's biggest cross-border payments infrastructure.`
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'SenexPay Dashboard'
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'SenexPay | Buy & Sell Bitcoin and USDT securely.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: `SenexPay is the easiest and most reliable platform to exchange cryptocurrency. We are building Africa's biggest cross-border payments infrastructure.`
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: '/img/senexpay-og-image-sq.png'
      },
      {
        hid: 'twitter:image:src',
        property: 'twitter:image:src',
        content: '/img/senexpay-og-image-sq.png'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.1.11/client.min.js',
        type: 'text/javascript'
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/global.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/api', ssr: true },
    { src: '~/plugins/axios', ssr: true },
    { src: '~/plugins/vue-notification', ssr: false },
    { src: '~/plugins/v-select', ssr: false },
    '~plugins/vue-final-modal.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/sentry',
    'nuxt-facebook-pixel-module',
    '@nuxtjs/auth-next',
    [
      '@nuxtjs/recaptcha',
      {
        hideBadge: true,
        siteKey: process.env.RECAPTCHA_SITE_KEY,
        version: 3
      }
    ],
    [
      'cookie-universal-nuxt',
      {
        alias: 'cookiz'
      }
    ],
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/onesignal'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {
  //   // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
  //   baseURL: '/',
  // },

  axios: {
    baseURL: process.env.API_URL
      // process.env.NODE_ENV === 'development'
      //   ? process.env.API_URL_DEV
      //   : process.env.API_URL_PROD
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          welcome: 'Welcome'
        }
      }
    }
  },

  facebook: {
    /* module options */
    track: 'PageView',
    pixelId: process.env.FACEBOOK_PIXEL_ID,
    autoPageView: true,
    disabled: false
  },

  auth: {
    redirect: {
      login: '/signin/',
      logout: '/signin',
      callback: '/signin/',
      home: false
    },
    watchLoggedIn: false,
    fullPathRedirect: true,
    strategies: {
      local: {
        token: {
          property: 'access',
          type: 'JWT'
        },
        user: {
          property: false,
          autoFetch: false
        },
        endpoints: {
          login: { url: '/auth/login/', method: 'post' },
          logout: false,
          user: { url: '/auth/users/me/', method: 'get' }
        }
      }
    }
  },

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID
  },

  oneSignal: {
    init: {
      appId: process.env.ONE_SIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    },
    cdn: true,
    OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'SenexPAY',
      lang: 'en',
      author: 'Rikozone Technology',
      categories: ['finance', 'money', 'exchange']
    },
    workbox: {
      // options
      // dev: true,
      offlineAnalytics: true,
      config: {
        // debug: true
      }
    }
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    disabled: process.env.NODE_ENV === 'development',
    config: {}
  },

  sitemap: {
    hostname: 'https://app.senexpay.com',
    defaults: {
      priority: 1,
      lastmod: new Date()
    },
    // routes: [],
    exclude: ['/invoice', '/activate', '/beneficiaries', '/dashboard', '/history', '/orders', '/order', '/order/checkout', '/profile', '/re-activation', '/secret', '/settings', '/verify', '/not-found']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-final-modal']
  },
}
