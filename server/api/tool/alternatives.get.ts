// API endpoint to get the data about tool's alternatives
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  // Get query parameters instead of body
  const query = getQuery(event);
  const mainToolId = query.mainToolId as string;
  const alternativeIds = Array.isArray(query['alternativeIds[]'])
    ? (query['alternativeIds[]'] as string[])
    : ([query['alternativeIds[]']].filter(Boolean) as string[]);
  const amount = query.amount ? parseInt(query.amount as string) : undefined;

  // Validate input
  if (!mainToolId || !alternativeIds || !Array.isArray(alternativeIds)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Invalid input: mainToolId must be a string and alternativeIds must be an array',
    });
  }

  try {
    const database = mongoose.connection.useDb('Tools');
    const collection = database.collection('Main');

    const mainObjectId = new mongoose.Types.ObjectId(mainToolId);
    const alternativeObjectIds = alternativeIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

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

    const mainTool = await collection.findOne(
      { _id: mainObjectId },
      { projection }
    );

    const alternativesQuery = collection.find(
      { _id: { $in: alternativeObjectIds } },
      { projection }
    );

    if ((amount ?? 0) > 0) {
      alternativesQuery.limit(amount ?? 0);
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
