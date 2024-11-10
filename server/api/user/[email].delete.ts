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
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required',
      });
    }

    await connectToDatabase();

    const database = mongoose.connection.useDb('User');
    const collection = database.collection('Users');

    const result = await collection.deleteOne({ email });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Error deleting account:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete account',
    });
  }
});
