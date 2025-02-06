// Composable function to fetch alternatives

export function useFetchAlternatives(
  toolId?: string,
  alternativeIds?: string[],
  initialAmount?: number
) {
  const alternatives = ref<Alternative[]>([])
  const mainTool = ref<Tool | null>(null)
  const error = ref<Error | null>(null)

  const fetchAlternatives = async (amount = initialAmount) => {
    try {
      // If toolId is not provided -> fetch it based on the name
      if (!toolId) {
        const route = useRoute()
        const toolName = route.params.name as string

        try {
          const toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
            params: { alternativesOnly: 'true' },
          })
          toolId = toolData._id
          alternativeIds = toolData.alternatives || []
        } catch (e) {
          console.error('Failed to fetch tool data:', e)
          error.value =
            e instanceof Error ? e : new Error('Unknown error occurred')
          return
        }
      }

      // If toolId is available or we fetched it -> fetch alternatives for the tool
      if (toolId && alternativeIds) {
        // Convert parameters to URL search params instead of body
        const params = new URLSearchParams()
        params.append('mainToolId', toolId)
        if (alternativeIds.length > 0) {
          alternativeIds.forEach((id) => params.append('alternativeIds[]', id))
        }
        if (amount !== undefined) {
          params.append('amount', amount.toString())
        }

        // Fetch alternatives using query parameters
        const response = await $fetch(
          `/api/tool/alternatives?${params.toString()}`
        )

        mainTool.value = response.mainTool || null
        alternatives.value = response.alternatives || []
      } else {
        error.value = new Error('Tool ID or alternative IDs are missing')
      }
    } catch (e) {
      console.error('Error fetching alternatives:', e)
      error.value = e instanceof Error ? e : new Error('Unknown error occurred')
    }
  }

  const stopWatch = watchEffect(() => {
    fetchAlternatives()
  })

  const retryFetch = (amount?: number) => {
    fetchAlternatives(amount)
  }

  onUnmounted(() => {
    stopWatch()
  })

  return {
    alternatives,
    mainTool,
    error,
    retryFetch,
  }
}
