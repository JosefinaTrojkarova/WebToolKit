import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const database = client.db('Tools')
    const collection = database.collection('Main')

    const data = await collection.find({}).toArray()
    
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Internal Server Error' }
  } finally {
    await client.close()
  }
})