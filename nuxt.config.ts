// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,

    auth: {
      secret: process.env.AUTH_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  css: ['~/assets/styles/reset.css'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/global.scss" as *;',
          api: 'modern-compiler',
        },
      },
    },
  },

  app: {
    head: {
      style: [
        {
          children:
            ':root { font-family: "Ubuntu Sans", sans-serif; background-color: #edeeef; }',
        },
      ],
      link: [
        {
          rel: 'preconnect', // Google Fonts
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect', // Google Fonts
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet', // Material Symbols Rounded font
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        },
        {
          rel: 'preconnect', // Google Fonts
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet', // Material Symbols Rounded font
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        },
        {
          rel: 'stylesheet', // Kanit font
          href: 'https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        },
        {
          rel: 'stylesheet', // Ubuntu font
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap',
        },
      ],
    },
  },

  modules: [
    '@nuxt/test-utils/module',
    '~~/modules/auto-import-types',
    '@sidebase/nuxt-auth',
  ],

  auth: {
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true,
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },

  imports: {
    dirs: ['server/utils', 'server/models'],
  },

  compatibilityDate: '2024-07-31',
});
