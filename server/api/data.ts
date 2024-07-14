import { MongoClient } from 'mongodb'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 })

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp()
  const mongoClient = nitroApp.mongoClient as MongoClient | undefined

  if (!mongoClient) {
    console.error('MongoDB client is not available')
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection error',
    })
  }

  const cacheKey = 'toolsData'
  const query = getQuery(event)
  const explore = query.basic === 'true'

  const cachedData = cache.get(cacheKey + (explore ? '_explore' : '_full'))
  if (cachedData) {
    return cachedData
  }

  try {
    const database = mongoClient.db('Tools')
    const collection = database.collection('Main')

    let data
    if (explore) {
      data = await collection.find({}, { projection: { name: 1, description: 1, logo: 1 } }).toArray()
    } else {
      data = await collection.find({}).toArray()
    }

    cache.set(cacheKey + (explore ? '_explore' : '_full'), data)

    return data
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})