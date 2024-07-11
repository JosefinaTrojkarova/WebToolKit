// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-09",

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI
  },

  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        strict: true,
        types: ['@types/node', '@nuxt/types']
      }
    }
  }
})