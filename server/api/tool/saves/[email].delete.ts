// API endpoint for deleting a tool save from a user's account
import User from '../../../../server/models/User';
import Tool from '../../../../server/models/Tool';

export default defineEventHandler(async (event) => {
  const { email } = event.context.params || {};

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    });
  }

  const body = await readBody(event);
  const toolName: string = body.toolName;

  if (!toolName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool ID is missing in the request body',
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

    if (!user.saves) {
      user.saves = [];
    }

    if (user.saves.includes(toolName)) {
      user.saves = user.saves.filter((save) => save !== toolName);
      await user.save();

      // Decrease the saves count in the Tool model
      await Tool.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${toolName}$`, 'i') } },
        { $inc: { 'rating.saves': -1 } }
      );
    }

    return { message: 'Tool deleted successfully' };
  } catch (error) {
    console.error('Error saving tool:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
