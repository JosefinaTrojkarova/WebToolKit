// Composable function to fetch reviews

export function useFetchReviews(toolId?: string, initialAmount?: number) {
  // Reactive state to hold the fetched reviews and any errors that occur
  const reviews = ref<Review[]>([]);
  const error = ref<Error | null>(null);
  const toolData = ref<ReviewPage[]>([]);

  // Function to fetch reviews
  const fetchReviews = async (amount = initialAmount) => {
    let id = toolId;
    // If toolId is not provided -> fetch it based on the name
    if (!id) {
      // Get toolName from the URL if toolId is not provided
      const route = useRoute();
      const toolName = route.params.name;

      // Fetch tool data to get toolId if it's not provided
      try {
        const fetchedToolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { reviewsOnly: 'true' },
        });
        id = fetchedToolData._id; // Assign the fetched toolId
        toolData.value = fetchedToolData;
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return;
      }
    }

    // If toolId is available, or we fetched it -> fetch reviews for the tool
    if (id) {
      try {
        const params: any = { toolId: id };
        if (amount) {
          params.limit = amount; // Apply limit if provided
        }
        // Fetch reviews from the API
        const data = await $fetch('/api/tool/reviews', { params });
        reviews.value = data || []; // Set fetched reviews or an empty array if no data
      } catch (e) {
        console.error('Failed to fetch reviews or tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    } else {
      error.value = new Error('Tool ID is missing');
    }
  };

  // Watch effect to automatically trigger fetching whenever the reactive dependencies change
  const stopWatch = watchEffect(() => {
    fetchReviews();
  });

  // Function to retry fetching
  const retryFetch = (amount?: number) => {
    fetchReviews(amount);
  };

  // Cleanup watcher on component unmount
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
