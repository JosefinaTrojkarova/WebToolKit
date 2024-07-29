// Purpouse: API endpoint to get all the data about categories from the database.

import { MongoClient } from 'mongodb';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

  // Function to get the MongoDB client
  async function getMongoClient(): Promise<MongoClient> {
    let retries = 0;
    const maxRetries = 10;
    const retryDelay = 500;

    while (retries < maxRetries) {
      if (nitroApp.mongoClient) {
        return nitroApp.mongoClient;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    }
    throw new Error('MongoDB client is not available');
  }

  try {
    const mongoClient = await getMongoClient();
    const cacheKey = 'categoriesData';

    // Check if the data is already cached and return it
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const database = mongoClient.db('Tools');
    const collection = database.collection('Categories');

    // Fetch all categories from the collection
    const data = await collection.find({}).toArray();

    // Cache the data
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
