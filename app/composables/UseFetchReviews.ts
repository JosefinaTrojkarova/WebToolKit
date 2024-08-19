// Composable function to fetch reviews
// Used in: pages/tool/[name]/index.vue and pages/tool/[name]/reviews.vue

export function useFetchReviews(toolId?: string, initialAmount?: number) {
  const reviews = ref<Review[]>([]);
  const error = ref<Error | null>(null);

  const fetchReviews = async (amount = initialAmount) => {
    if (!toolId) {
      // Get toolName from the URL if toolId is not provided
      const route = useRoute();
      const toolName = route.params.name;

      // Fetch tool data if toolId is not provided
      try {
        const toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { reviewsOnly: 'true' },
        });
        toolId = toolData._id;
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return;
      }
    }

    if (toolId) {
      try {
        const params: any = { toolId };
        if (amount) {
          params.limit = amount;
        }
        const data = await $fetch('/api/tool/reviews', { params });
        reviews.value = data || [];
      } catch (e) {
        console.error('Failed to fetch reviews:', e);
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
    error,
    retryFetch,
  };
}
