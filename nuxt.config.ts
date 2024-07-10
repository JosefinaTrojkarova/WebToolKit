// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-09",

  // Add server-side middleware support
  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // Configure runtime config for environment variables
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI
  },

  // TypeScript configuration
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