export function useFetchReviews(toolData: Ref<Tool | null>) {
  const reviews = ref<Review[]>([]);

  const fetchReviews = async () => {
    if (toolData.value && toolData.value._id) {
      try {
        const { data: reviewData, error } = await useFetch<Review[]>(
          '/api/tool/reviews',
          {
            params: { toolId: toolData.value._id },
          }
        );
        if (error.value) throw error.value;
        reviews.value = reviewData.value || [];
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
