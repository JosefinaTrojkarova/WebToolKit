// API endpoint to delete a review by ID
import Reviews from '../../../models/Review';
import User from '../../../../server/models/User';
import Tool from '../../../../server/models/Tool';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const { reviewId } = await readBody(event);

  if (!reviewId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Review ID and Tool ID are required',
    });
  }

  try {
    // Find the review before deletion to get its rating
    const reviewDoc = await Reviews.findOne(
      { 'reviews._id': reviewId },
      { 'reviews.$': 1, tool: 1 }
    );

    if (!reviewDoc || !reviewDoc.reviews[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Review not found',
      });
    }

    const review = reviewDoc.reviews[0];
    const toolId = reviewDoc.tool;

    // Find and update user's contributions
    const userUpdate = await User.findByIdAndUpdate(
      review.user,
      {
        $pull: {
          contributions: {
            _id: mongoose.Types.ObjectId.createFromHexString(reviewId),
          },
        },
      },
      { new: true }
    );

    if (!userUpdate) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User contribution not found',
      });
    }

    // Update tool rating stats
    await Tool.findOneAndUpdate(
      { _id: toolId },
      {
        $inc: {
          'rating.reviews': -1,
          [`rating.stats.${review.rating}`]: -1,
        },
        $set: {
          'rating.stars': await recalculateRating(toolId, review.rating),
        },
      }
    );

    // Remove review from Reviews collection
    await Reviews.updateOne(
      { _id: reviewDoc._id },
      { $pull: { reviews: { _id: reviewId } } }
    );

    return { message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete review',
    });
  }
});

// Helper function to recalculate average rating
async function recalculateRating(toolId: string, deletedRating: number) {
  const tool = await Tool.findById(toolId);
  if (!tool) return 0;

  const currentTotal = tool.rating.stars * tool.rating.reviews;
  const newTotal = currentTotal - deletedRating;
  const newCount = tool.rating.reviews - 1;

  return newCount === 0 ? 0 : Number((newTotal / newCount).toFixed(2));
}
