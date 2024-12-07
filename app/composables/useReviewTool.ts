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
      const response = await $fetch('/api/tool/comments/reviews', {
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

  return {
    postReview,
    error,
  };
};
