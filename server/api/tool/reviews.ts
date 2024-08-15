// Purpose: API endpoint to get the reviews of specific tool.

export default defineEventHandler(async (event) => {
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
