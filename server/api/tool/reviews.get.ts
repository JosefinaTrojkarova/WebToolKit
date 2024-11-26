// API endpoint to get the reviews of specific tool

import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const toolId = query.toolId as string;

  const amount = parseInt(query.limit as string) || 0; // 0 means no limit (all reviews)

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: toolId is required',
    });
  }

  try {
    const database = mongoose.connection.useDb('Tools');
    const collection = database.collection('Comments');

    const usersDatabase = mongoose.connection.useDb('User');
    const usersCollection = usersDatabase.collection('Users');

    // Fetch the tool document by toolId
    const toolDocument = await collection.findOne({
      tool: toolId,
    });

    if (!toolDocument) {
      return [];
    }

    // Extract reviews from the reviews array in the tool document
    const reviews = toolDocument.reviews || [];

    // Filter valid reviews
    const validReviews = reviews.filter(
      (review: any) => review.comment && review.rating
    );

    // Apply the amount if provided
    if (amount > 0) {
      validReviews.splice(amount);
    }

    // Fetch user data for all reviews
    const userIds = validReviews.map((review: any) => review.user);
    const users = await usersCollection
      .find({
        $or: [
          { _id: { $in: userIds } },
          {
            _id: {
              $in: userIds.map((id: any) => new mongoose.Types.ObjectId(id)),
            },
          },
        ],
      })
      .toArray();

    // Create a map of user data for quick lookup
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Map reviews to the required format, including user data
    const mappedReviews = validReviews.map((review: any) => {
      const userData = userMap.get(review.user);
      return {
        comment: review.comment,
        rating: review.rating,
        date: review.date.toISOString(),
        username: userData ? userData.username : 'Anonymous',
        userHandle: userData ? userData.handle : 'anonymous',
        userContributions: userData ? userData.contributions : '?',
        userProfilePic: userData
          ? userData.picture
          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      };
    });

    return mappedReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
