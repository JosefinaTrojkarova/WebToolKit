import { MongoClient } from 'mongodb'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 200, checkperiod: 400 })

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const client = new MongoClient(config.mongodbUri as string)

    const cacheKey = 'toolsData'

    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }

    try {
        await client.connect()
        const database = client.db('Tools')
        const collection = database.collection('Main')

        const data = await collection.find({}, {}).toArray()

        cache.set(cacheKey, data)

        return data
    } catch (error) {
        console.error(error)
        return { error: 'Internal Server Error' }
    } finally {
        await client.close()
    }
})