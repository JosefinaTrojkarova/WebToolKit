export function useFetchReviews(toolData: Ref<Tool | null>) {
  const reviews = ref<Review[]>([]);

  const fetchReviews = async () => {
    if (toolData.value && toolData.value._id) {
      try {
        const data = await $fetch('/api/tool/reviews', {
          params: { toolId: toolData.value._id },
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

  const retryFetch = () => {
    fetchReviews();
  };

  return {
    reviews,
    retryFetch,
  };
}
