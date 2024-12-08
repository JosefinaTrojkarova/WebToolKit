// // API endpoint to delete a review by ID
// import Review from '../../../models/Review';
// import User from '../../../../server/models/User';
// import Tool from '../../../../server/models/Tool';

// export default defineEventHandler(async (event) => {
//   const { reviewId } = await readBody(event);

//   if (!reviewId) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'Review ID is required',
//     });
//   }

//   try {
//     // Find the review before deletion to get its rating
//     const comment = await Review.findOne(
//       { tool: toolId, 'reviews._id': reviewId },
//       { 'reviews.$': 1 }
//     );

//     if (!comment || !comment.reviews[0]) {
//       throw createError({
//         statusCode: 404,
//         statusMessage: 'Review not found',
//       });
//     }

//     const review = comment.reviews[0];

//     // Remove review from user's contributions
//     await User.updateOne(
//       { 'contributions._id': reviewId },
//       { $pull: { contributions: { _id: reviewId } } }
//     );

//     // Update tool rating stats
//     await Tool.findOneAndUpdate(
//       { _id: toolId },
//       {
//         $inc: {
//           'rating.reviews': -1,
//           [`rating.stats.${review.rating}`]: -1,
//         },
//         $set: {
//           'rating.stars': await recalculateRating(toolId, review.rating),
//         },
//       }
//     );

//     // Remove review from Reviews collection
//     await Review.updateOne(
//       { tool: toolId },
//       { $pull: { reviews: { _id: reviewId } } }
//     );

//     return { message: 'Review deleted successfully' };
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to delete review',
//     });
//   }
// });

// // Helper function to recalculate average rating
// async function recalculateRating(toolId: string, deletedRating: number) {
//   const tool = await Tool.findById(toolId);
//   if (!tool) return 0;

//   const currentTotal = tool.rating.stars * tool.rating.reviews;
//   const newTotal = currentTotal - deletedRating;
//   const newCount = tool.rating.reviews - 1;

//   return newCount === 0 ? 0 : Number((newTotal / newCount).toFixed(2));
// }
