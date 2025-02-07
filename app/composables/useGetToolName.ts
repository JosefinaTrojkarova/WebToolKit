export function useGetToolName() {
  const getToolName = async (toolId: string) => {
    try {
      const response = await $fetch<{ name: string }>(
        `/api/tool/name/${toolId}`,
        {
          method: 'GET',
        }
      )
      return response.name
    } catch (error) {
      console.error('Error fetching tool name:', error)
      return null
    }
  }

  return {
    getToolName,
  }
}
