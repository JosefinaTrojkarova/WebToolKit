// Composable function to fetch reviews
export function useFetchReviews(toolId?: string, initialAmount?: number) {
  const reviews = ref<Review[]>([])
  const toolData = ref<ReviewPage[]>([])
  const error = ref<Error | null>(null)

  // Split fetch functions
  const fetchToolData = async () => {
    const route = useRoute()
    const toolName = route.params.name

    try {
      const fetchedToolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
        params: { reviewsOnly: 'true' },
      })
      toolId = fetchedToolData._id
      toolData.value = fetchedToolData
      return toolId
    } catch (e) {
      console.error('Failed to fetch tool data:', e)
      error.value = e instanceof Error ? e : new Error('Unknown error occurred')
      return null
    }
  }

  const fetchReviews = async (amount = initialAmount) => {
    const currentToolId = toolId || (await fetchToolData())
    if (!currentToolId) return

    try {
      const params: any = { toolId: currentToolId }
      if (amount) params.limit = amount
      const data = await $fetch('/api/tool/reviews/reviews', { params })
      reviews.value = data || []
    } catch (e) {
      console.error('Failed to fetch reviews:', e)
      error.value = e instanceof Error ? e : new Error('Unknown error occurred')
    }
  }

  const retryToolData = async () => {
    await fetchToolData()
  }

  const retryReviews = (amount?: number) => {
    fetchReviews(amount)
  }

  const retryAll = async () => {
    await retryToolData()
    await retryReviews()
  }

  // Initial fetch
  const stopWatch = watchEffect(() => {
    fetchReviews()
  })

  onUnmounted(() => {
    stopWatch()
  })

  return {
    reviews,
    toolData,
    error,
    retryReviews,
    retryToolData,
    retryAll,
  }
}
