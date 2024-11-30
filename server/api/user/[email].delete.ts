// API endpoint to delete a user account by email
import User from '../../models/User';

export default defineEventHandler(async (event) => {
  const { email } = event.context.params || {};

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    });
  }

  try {
    const result = await User.deleteOne({ email });

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
