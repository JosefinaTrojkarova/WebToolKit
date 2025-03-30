import mongoose from 'mongoose'

const MAX_RETRIES = 4
const RETRY_DELAY = 3000

async function connectWithRetry(retryCount = 0): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) return

    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })

    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed:`, error)

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return connectWithRetry(retryCount + 1)
    }

    throw error
  }
}

export default defineNitroPlugin(async (nitroApp) => {
  await connectWithRetry().catch((error) => {
    console.error('Failed to establish initial MongoDB connection:', error)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...')
    connectWithRetry()
  })

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error)
  })

  nitroApp.hooks.hook('request', async () => {
    if (mongoose.connection.readyState !== 1) {
      await connectWithRetry()
    }
  })

  nitroApp.hooks.hook('close', async () => {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  })
})
