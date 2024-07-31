export function useFetchToolpage(name: string) {
  const { data, error, refresh } = useFetch<Tool>(`/api/tool/${name}`, {
    key: `tool-${name}`,
    default: () => ({ alternatives: [], _id: '' }),
  });

  const alternatives = ref<Alternative[]>([]);
  const reviews = ref<Review[]>([]);

  const fetchAlternatives = async () => {
    if (data.value && data.value.alternatives.length > 0) {
      try {
        const { data: altData, error } = await useFetch<Alternative[]>(
          '/api/tool/alternatives',
          {
            method: 'POST',
            body: { ids: data.value.alternatives },
          }
        );
        if (error.value) throw error.value;
        alternatives.value = altData.value || [];
      } catch (e) {
        console.error('Failed to fetch alternatives:', e);
      }
    }
  };

  const fetchReviews = async () => {
    if (data.value && data.value._id) {
      try {
        const { data: reviewData, error } = await useFetch<Review[]>(
          '/api/tool/reviews',
          {
            params: { toolId: data.value._id },
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
    fetchAlternatives();
    fetchReviews();
  });

  const retryFetch = () => {
    refresh();
    fetchAlternatives();
    fetchReviews();
  };

  return {
    data,
    error,
    alternatives,
    reviews,
    retryFetch,
  };
}
