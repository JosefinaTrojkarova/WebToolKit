// Purpose: API endpoint to get the data about tool's alternatives.
// Used in:

import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { mainToolId, alternativeIds, amount } = body;

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

    // Fetch alternatives with optional limit (amount)
    const alternativesQuery = collection.find(
      { _id: { $in: alternativeObjectIds } },
      { projection }
    );

    if (amount > 0) {
      alternativesQuery.limit(amount);
    }

    const alternatives = await alternativesQuery.toArray();

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
