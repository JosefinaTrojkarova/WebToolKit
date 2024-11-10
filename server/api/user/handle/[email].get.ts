import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  if (!params || !params.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    });
  }
  const { email } = params;

  try {
    await connectToDatabase();

    const database = mongoose.connection.useDb('User');
    const collection = database.collection('Users');

    const user = await collection.findOne(
      { email },
      { projection: { handle: 1 } }
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { handle: user.handle };
  } catch (error) {
    console.error('Detailed error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
