// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-09",

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI
  },

  css: [
    '~/assets/styles/reset.css',
    //'~/assets/styles/global.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/global.scss" as *;'
        }
      }
    }
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet', // Kanit font
          href: 'https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
        },
        {
          rel: 'stylesheet', // Ubuntu font
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap'
        }
      ]
    }
  }
})