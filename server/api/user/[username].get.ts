// API endpoint to get user data by username
import User from '../../models/User';

export default defineEventHandler(async (event) => {
  const username = event.context.params?.email;

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username parameter is missing',
    });
  }

  try {
    const user = await User.findOne(
      { username },
      { _id: 0, username: 1, name: 1, image: 1 }
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
