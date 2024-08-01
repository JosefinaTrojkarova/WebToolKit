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

  const query = getQuery(event);
  const toolId = query.toolId as string;

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: toolId is required',
    });
  }

  try {
    const mongoClient = await getMongoClient();
    const database = mongoClient.db('Tools');
    const collection = database.collection('Comments');

    const comments = await collection
      .find({ tool: toolId })
      .sort({ date: -1 })
      .toArray();

    return comments;
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
