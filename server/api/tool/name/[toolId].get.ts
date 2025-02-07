import Tool from '../../../models/Tool'

export default defineEventHandler(async (event) => {
  const toolId = event.context.params?.toolId

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool ID is required',
    })
  }

  try {
    const tool = await Tool.findById(toolId)

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
