import mongoose from 'mongoose'

const MAX_RETRIES = 4
const RETRY_DELAY = 3000
const CONNECTION_TIMEOUT = 5000

let isConnecting = false
let connectionPromise: Promise<void> | null = null

async function connectWithRetry(retryCount = 0): Promise<void> {
  if (isConnecting) {
    return connectionPromise!
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return
    }

    isConnecting = true
    connectionPromise = new Promise(async (resolve, reject) => {
      try {
        await mongoose.connect(process.env.MONGODB_URI!, {
          serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
          connectTimeoutMS: CONNECTION_TIMEOUT,
          socketTimeoutMS: CONNECTION_TIMEOUT,
          bufferCommands: false,
        })

        console.log('Successfully connected to MongoDB')
        resolve()
      } catch (error) {
        console.error(
          `MongoDB connection attempt ${retryCount + 1} failed:`,
          error
        )

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          isConnecting = false
          return connectWithRetry(retryCount + 1)
        }

        reject(error)
      } finally {
        isConnecting = false
        connectionPromise = null
      }
    })

    return connectionPromise
  } catch (error) {
    isConnecting = false
    connectionPromise = null
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
    if (!isConnecting) {
      connectWithRetry()
    }
  })

  nitroApp.hooks.hook('request', async (event) => {
    if (!event.path.startsWith('/api')) return

    if (mongoose.connection.readyState !== 1) {
      await connectWithRetry()
    }
  })

  nitroApp.hooks.hook('close', async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
      console.log('MongoDB connection closed')
    }
  })
})
