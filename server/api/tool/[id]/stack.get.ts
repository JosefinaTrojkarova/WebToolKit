import { Types } from 'mongoose'
import Tool from '../../../models/Tool'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool ID is required',
    })
  }

  try {
    if (!Types.ObjectId.isValid(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid tool ID format',
      })
    }

    const tool = await Tool.findById(id, 'name logo').lean()

    if (!tool) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      })
    }

    return tool
  } catch (error) {
    console.error('Error fetching tool:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
