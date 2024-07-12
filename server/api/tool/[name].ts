import { MongoClient } from 'mongodb'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const client = new MongoClient(config.mongodbUri as string)

    const { name } = event.context.params as { name: string }

    if (!name) {
        return { error: 'Tool name is required' }
    }

    const cacheKey = `toolData_${name}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }

    try {
        await client.connect()
        const database = client.db('Tools')
        const collection = database.collection('Main')

        const data = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })

        if (!data) {
            return { error: 'Tool not found' }
        }

        cache.set(cacheKey, data)

        return data
    } catch (error) {
        console.error(error)
        return { error: 'Internal Server Error' }
    } finally {
        await client.close()
    }
})
