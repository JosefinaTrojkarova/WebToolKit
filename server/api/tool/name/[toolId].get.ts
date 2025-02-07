import Tool from '../../../models/Tool'

export default defineEventHandler(async (event) => {
  const toolId = event.context.params?.toolId

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool ID or name is required',
    })
  }

  try {
    // First try to find by ID
    let tool = null
    if (toolId.match(/^[0-9a-fA-F]{24}$/)) {
      tool = await Tool.findById(toolId)
    }

    // If not found by ID, try to find by name
    if (!tool) {
      tool = await Tool.findOne({
        name: { $regex: new RegExp(`^${toolId}$`, 'i') },
      })
    }

    if (!tool) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      })
    }

    return { name: tool.name }
  } catch (error) {
    console.error('Error in tool name endpoint:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tool name',
    })
  }
})
