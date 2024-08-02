// Purpose: API endpoint to get the data about tool's alternatives.

import { MongoClient, ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

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

  const body = await readBody(event);
  const { ids } = body;

  if (!ids || !Array.isArray(ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: ids must be an array',
    });
  }

  try {
    const mongoClient = await getMongoClient();
    const database = mongoClient.db('Tools');
    const collection = database.collection('Main');

    const objectIds = ids.map((id) => ObjectId.createFromHexString(id));

    const alternatives = await collection
      .find(
        { _id: { $in: objectIds } },
        {
          projection: {
            _id: 1,
            name: 1,
            categories: 1,
            logo: 1,
            tags: 1,
            rating: { stars: 1, reviews: 1 },
            shortDescription: 1,
            pros: 1,
            cons: 1,
          },
        }
      )
      .toArray();

    return alternatives;
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      error.message === 'MongoDB client is not available'
    ) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Temporarily Unavailable',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
