// Purpose: API endpoint to get basic data about the tool and it's alternatives from the database.
// Used in: composables/UseFetchAlternatives.ts

import { MongoClient, ObjectId } from 'mongodb';

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

  // Get request body
  const body = await readBody(event);
  const { mainToolId, alternativeIds } = body;

  // Validate input
  if (!mainToolId || !alternativeIds || !Array.isArray(alternativeIds)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Invalid input: mainToolId must be a string and alternativeIds must be an array',
    });
  }

  try {
    // Get MongoDB client and collection
    const mongoClient = await getMongoClient();
    const database = mongoClient.db('Tools');
    const collection = database.collection('Main');

    const mainObjectId = ObjectId.createFromHexString(mainToolId);
    const alternativeObjectIds = alternativeIds.map((id) =>
      ObjectId.createFromHexString(id)
    );

    // Define projection for database queries
    const projection = {
      _id: 1,
      name: 1,
      categories: 1,
      logo: 1,
      tags: 1,
      rating: {
        stars: 1,
        reviews: 1,
        saves: 1,
      },
      shortDescription: 1,
      pros: 1,
      cons: 1,
    };

    // Fetch main tool
    const mainTool = await collection.findOne(
      { _id: mainObjectId },
      { projection }
    );

    // Fetch alternatives
    const alternatives = await collection
      .find({ _id: { $in: alternativeObjectIds } }, { projection })
      .toArray();

    return { mainTool, alternatives };
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
