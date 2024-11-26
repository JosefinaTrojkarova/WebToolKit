// Composable function to fetch reviews

export function useFetchReviews(toolId?: string, initialAmount?: number) {
  const reviews = ref<Review[]>([]);
  const toolData = ref<ReviewPage[]>([]);
  const error = ref<Error | null>(null);

  // Function to fetch reviews
  const fetchReviews = async (amount = initialAmount) => {
    // If toolId is not provided -> fetch it based on the name
    if (!toolId) {
      const route = useRoute();
      const toolName = route.params.name;

      try {
        const fetchedToolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { reviewsOnly: 'true' },
        });
        toolId = fetchedToolData._id;
        toolData.value = fetchedToolData;
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return;
      }
    }

    // If toolId is available, or we fetched it -> fetch reviews for the tool
    if (toolId) {
      try {
        const params: any = { toolId };
        if (amount) {
          params.limit = amount; // Apply limit if provided
        }
        // Fetch reviews from the API
        const data = await $fetch('/api/tool/reviews', { params });
        reviews.value = data || [];
      } catch (e) {
        console.error('Failed to fetch reviews or tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    } else {
      error.value = new Error('Tool ID is missing');
    }
  };

  const stopWatch = watchEffect(() => {
    fetchReviews();
  });

  const retryFetch = (amount?: number) => {
    fetchReviews(amount);
  };

  onUnmounted(() => {
    stopWatch();
  });

  return {
    reviews,
    toolData,
    error,
    retryFetch,
  };
}
