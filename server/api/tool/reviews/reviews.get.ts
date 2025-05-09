// API endpoint to get the reviews of specific tool
import Reviews from '../../../models/Review'
import User from '../../../models/User'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const toolId = query.toolId as string

  const amount = parseInt(query.limit as string) || 0 // 0 means no limit (all reviews)

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: toolId is required',
    })
  }

  try {
    // Fetch the tool document by toolId
    const toolDocument = await Reviews.findOne({
      tool: toolId,
    })

    if (!toolDocument) {
      return []
    }

    // Extract reviews from the reviews array in the tool document
    const reviews = toolDocument.reviews || []

    // Filter valid reviews
    const validReviews = reviews.filter(
      (review: any) => review.comment && review.rating
    )

    // Apply the amount if provided
    if (amount > 0) {
      validReviews.splice(amount)
    }

    // Fetch user data for all reviews
    const userIds = validReviews.map((review: any) => review.user)
    const users = await User.find({ _id: userIds })

    // Create a map of user data for quick lookup
    const userMap = new Map(users.map((user) => [user._id.toString(), user]))

    // Map reviews to the required format, including user data
    const mappedReviews = validReviews.map((review: any) => {
      const userData = userMap.get(review.user)
      return {
        _id: review._id,
        comment: review.comment,
        rating: review.rating,
        date: review.date.toISOString(),
        username: userData ? userData.username : 'unknown',
        name: userData ? userData.name : 'anonymous',
        userEmail: userData ? userData.email : null, // Add user email
        userProfilePic: userData
          ? userData.image
          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        userContributions: userData?.contributions
          ? userData.contributions?.length
          : 0,
      }
    })

    return mappedReviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
