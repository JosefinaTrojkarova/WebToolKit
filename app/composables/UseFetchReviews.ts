// Composable function to fetch reviews
// Used in: pages/tool/[name]/index.vue and pages/tool/[name]/reviews.vue

export function useFetchReviews(
  providedToolData?: Ref<Tool | null>,
  initialAmount?: number
) {
  const reviews = ref<Review[]>([]);
  const error = ref<Error | null>(null);
  const route = useRoute();
  const toolName = route.params.name;

  const fetchReviews = async (amount = initialAmount) => {
    let toolData: Tool | null = null;

    if (providedToolData) {
      // Use provided tool data
      toolData = providedToolData.value;
    } else if (toolName) {
      // Fetch tool data if not provided
      try {
        toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { reviewsOnly: 'true' },
        });
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return;
      }
    }

    if (toolData && toolData._id) {
      try {
        const params: any = { toolId: toolData._id };
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
      error.value = new Error('Tool data is incomplete');
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
