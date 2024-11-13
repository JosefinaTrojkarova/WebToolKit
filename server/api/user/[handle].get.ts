import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const params = event.context.params;

  if (!params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Handle parameter is missing',
    });
  }
  const handle = params.email;

  try {
    await connectToDatabase();

    const database = mongoose.connection.useDb('User');
    const collection = database.collection('Users');

    const user = await collection.findOne(
      { handle },
      { projection: { handle: 1, email: 1, name: 1, image: 1 } }
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { user };
  } catch (error) {
    console.error('Detailed error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
