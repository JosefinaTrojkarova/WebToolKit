// API endpoint to get the username of a specific user by email
import User from '../../../models/User'

export default defineEventHandler(async (event) => {
  const { email } = event.context.params || {}

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email parameter is missing',
    })
  }

  try {
    const user = await User.findOne({ email }, { username: 1, _id: 0 })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    return { username: user.username }
  } catch (error) {
    console.error('Detailed error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
