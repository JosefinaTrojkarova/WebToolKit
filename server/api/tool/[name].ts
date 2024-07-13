import { MongoClient } from 'mongodb'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

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

    const { name } = event.context.params as { name: string }

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tool name is required',
        })
    }

    const cacheKey = `toolData_${name}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }

    try {
        const database = mongoClient.db('Tools')
        const collection = database.collection('Main')

        const data = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })

        if (!data) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Tool not found',
            })
        }

        cache.set(cacheKey, data)

        return data
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }
})