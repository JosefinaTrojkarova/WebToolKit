export const useReviewTool = () => {
  const error = ref<string | null>(null);

  const postReview = async (
    toolId: string,
    user: string,
    comment: string,
    rating: number
  ) => {
    error.value = null;

    try {
      const response = await $fetch('/api/tool/reviews/reviews', {
        method: 'POST',
        body: {
          tool: toolId,
          user,
          comment,
          rating,
        },
      });
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to post review.';
      throw error.value;
    }
  };

  const getUserReview = async (email: string) => {
    const contributions = ref<object[]>([]);
    const error = ref<string | null>(null);
    error.value = null;

    try {
      const response = await $fetch<{ contributions: object[] }>(
        `/api/tool/reviews/${email}`,
        {
          method: 'GET',
        }
      );
      contributions.value = response.contributions;
      return contributions.value;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch reviews.';
      throw error.value;
    }
  };

  const deleteReview = async (reviewId: string) => {
    error.value = null;

    try {
      const response = await $fetch('/api/tool/reviews/reviews', {
        method: 'DELETE',
        body: { reviewId },
      });

      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete review';
      throw error.value;
    }
  };

  return {
    postReview,
    getUserReview,
    deleteReview,
    error,
  };
};
