import { MongoClient } from 'mongodb';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

  // function to get the mongo query
  async function getMongoClient(): Promise<MongoClient> {
    let retries = 0;
    const maxRetries = 10;
    const retryDelay = 500;

    while (retries < maxRetries) {
      if (nitroApp.mongoClient) {
        return nitroApp.mongoClient;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retries++;
    }
    throw new Error('MongoDB client is not available');
  }

  try {
    const mongoClient = await getMongoClient();

    const cacheKey = 'toolsData';
    const query = getQuery(event);
    const explore = query.explore === 'true';
    const contribute = query.contribute === 'true';

    // check if the data is already cached and return it
    const cachedData = cache.get(cacheKey + (explore ? '_explore' : contribute ? '_contribute' : '_full'));
    if (cachedData) {
      return cachedData;
    }

    const database = mongoClient.db('Tools');
    const collection = database.collection('Main');

    // get the data from the database and cache it
    let data;
    if (explore) {
      data = await collection.find({}, { projection: { name: 1, description: 1, logo: 1 } }).toArray();
    } else if (contribute) {
      data = await collection.find({}, { projection: { name: 1 } }).toArray();
    } else {
      data = await collection.find({}).toArray();
    }

    cache.set(cacheKey + (explore ? '_explore' : contribute ? '_contribute' : '_full'), data);

    return data;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
