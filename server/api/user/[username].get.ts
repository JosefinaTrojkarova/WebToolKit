// Fetch user by username

import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const username = event.context.params?.email;

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username parameter is missing',
    });
  }

  try {
    await connectToDatabase();

    const collection = mongoose.connection.useDb('User').collection('Users');

    const user = await collection.findOne(
      { username },
      { projection: { _id: 0, username: 1, name: 1, image: 1 } }
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
