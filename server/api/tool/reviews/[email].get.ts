// API endpoint to get user contributions by email
import User from '../../../models/User';

export default defineEventHandler(async (event) => {
  const { email } = event.context.params || {};

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    });
  }

  try {
    const user = await User.findOne(
      { email },
      { contributions: 1, _id: 0 }
    ).lean();

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { contributions: user.contributions || [] };
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
