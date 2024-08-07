// Purpose: API endpoint to get all the data about one specific tool from the database.

import { MongoClient } from 'mongodb';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

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
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    }
    throw new Error('MongoDB client is not available');
  }

  // get name of the tool from the URL
  const { name } = event.context.params as { name: string };
  const query = getQuery(event); // Retrieve query parameters from the event
  const isHeader = query.header === 'true'; // Determine if the header projection is needed

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool name is required',
    });
  }

  // check if the data is already cached and return it
  const cacheKey = `toolData_${name}_${isHeader ? 'header' : 'main'}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const mongoClient = await getMongoClient();
    const database = mongoClient.db('Tools');
    const collection = database.collection('Main');

    // Define projection based on the query parameter
    const projection = isHeader
      ? {
          name: 1,
          logo: 1,
          shortDescription: 1,
          rating: {
            stars: 1,
            saves: 1,
          },
        }
      : {
          categories: 1,
          logo: 1,
          description: 1,
          tags: {
            pricing: 1,
            licensing: 1,
          },
          rating: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            reviews: 1,
          },
          resources: {
            link: 1,
            type: 1,
          },
          video: 1,
          pros: {
            name: 1,
            votes: 1,
          },
          cons: {
            name: 1,
            votes: 1,
          },
          alternatives: 1,
        };

    // find single tool by name and ignore case
    const data = await collection.findOne(
      { name: { $regex: new RegExp(`^${name}$`, 'i') } },
      { projection }
    );

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      });
    }

    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === 'MongoDB client is not available') {
        throw createError({
          statusCode: 503,
          statusMessage: 'Service Temporarily Unavailable',
        });
      } else if (error.message === 'Tool not found') {
        throw error;
      }
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
