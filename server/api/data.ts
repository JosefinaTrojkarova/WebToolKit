import { MongoClient } from 'mongodb'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 })

export default defineEventHandler(async (event) => {
  console.log('Handler started');
  const nitroApp = useNitroApp()
  console.log('Nitro app retrieved');
  const mongoClient = nitroApp.mongoClient as MongoClient | undefined
  console.log('MongoDB client:', mongoClient ? 'Available' : 'Not available');

  if (!mongoClient) {
    console.error('MongoDB client is not available')
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection error',
    })
  }

  const cacheKey = 'toolsData'
  const query = getQuery(event)
  console.log('Query:', query);
  const explore = query.basic === 'true' || query.explore === 'true'
  console.log('Explore mode:', explore);

  const cachedData = cache.get(cacheKey + (explore ? '_explore' : '_full'))
  if (cachedData) {
    console.log('Returning cached data');
    return cachedData
  }

  try {
    const database = mongoClient.db('Tools')
    const collection = database.collection('Main')
    console.log('Database and collection accessed');

    let data
    if (explore) {
      data = await collection.find({}, { projection: { name: 1, description: 1, logo: 1 } }).toArray()
    } else {
      data = await collection.find({}).toArray()
    }
    console.log(`Data retrieved: ${data.length} items`);

    cache.set(cacheKey + (explore ? '_explore' : '_full'), data)

    console.log('Sending response with data length:', data.length);
    return { success: true, data: data };
  } catch (error) {
    console.error('Detailed error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal Server Error',
    })
  }
})