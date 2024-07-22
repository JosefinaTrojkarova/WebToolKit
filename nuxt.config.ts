// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-09",

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI
  },

  css: [
    '~/assets/styles/global.scss', 
    '~/assets/styles/reset.css',
  ],
})