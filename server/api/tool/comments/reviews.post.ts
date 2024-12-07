// Api endpoint for adding a review to a tool
import Comments from '../../../../server/models/Comments';
import User from '../../../../server/models/User';
import Tool from '../../../../server/models/Tool';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { tool, user: userEmail, comment, rating } = body;

  if (!tool || !userEmail || !comment || !rating) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    const reviewItem = {
      user: user._id,
      comment,
      rating,
      date: new Date(),
    };

    // Add review to Comments
    await Comments.findOneAndUpdate(
      { tool },
      {
        $push: {
          reviews: {
            $each: [reviewItem],
            $position: 0,
          },
        },
      },
      { upsert: true }
    );

    // Get the tool document to calculate new rating
    const toolDoc = await Tool.findOne({ _id: tool });
    if (!toolDoc) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      });
    }

    // Calculate new average rating
    const currentTotal = toolDoc.rating.stars * toolDoc.rating.reviews;
    const newTotal = currentTotal + rating;
    const newCount = toolDoc.rating.reviews + 1;
    const newAverage = newTotal / newCount;

    // Update tool with new rating stats
    await Tool.findOneAndUpdate(
      { _id: tool },
      {
        $inc: {
          'rating.reviews': 1,
          [`rating.stats.${rating}`]: 1,
        },
        $set: {
          'rating.stars': Number(newAverage.toFixed(2)),
        },
      }
    );

    return { message: 'Review added successfully' };
  } catch (error) {
    console.error('Error adding review:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
