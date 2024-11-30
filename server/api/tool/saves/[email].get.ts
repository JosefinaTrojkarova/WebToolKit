// API endpoint to get all user saved tools
import User from '../../../../server/models/User';

export default defineEventHandler(async (event) => {
  const { email } = event.context.params || {};

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { saves: user.saves };
  } catch (error) {
    console.error('Error fetching saves:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
