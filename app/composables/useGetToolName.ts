export function useGetToolName() {
  const getToolName = async (identifier: string) => {
    try {
      const response = await $fetch<{ name: string }>(
        `/api/tool/name/${identifier}`,
        {
          method: 'GET',
        }
      )
      return response.name
    } catch (error) {
      console.error('Error fetching tool name:', error)
      return identifier
    }
  }

  return {
    getToolName,
  }
}
