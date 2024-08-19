// Composable function to fetch alternatives
// Used in: pages/tool/[name]/index.vue and pages/tool/[name]/reviews.vue

export function useFetchReviews(
  toolData: Ref<Tool | null>,
  initialAmount?: number
) {
  const reviews = ref<Review[]>([]);

  const fetchReviews = async (amount = initialAmount) => {
    // Set limit to initialLimit by default
    if (toolData.value._id) {
      try {
        const params: any = { toolId: toolData.value._id };
        if (amount) {
          params.limit = amount; // Add the limit to the parameters if provided
        }
        const data = await $fetch('/api/tool/reviews', {
          params,
        });
        reviews.value = data || [];
      } catch (e) {
        console.error('Failed to fetch reviews:', e);
      }
    }
  };

  watchEffect(() => {
    fetchReviews();
  });

  const retryFetch = (limit?: number) => {
    fetchReviews(limit);
  };

  return {
    reviews,
    retryFetch,
  };
}
