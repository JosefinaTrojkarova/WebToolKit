export const useSaveTool = () => {
  const error = ref<string | null>(null);

  const postSaveTool = async (email: string, toolName: string) => {
    error.value = null;

    try {
      const response = await $fetch(`/api/tool/saves/${email}`, {
        method: 'POST',
        body: { toolName },
      });
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save tool.';
      throw error.value;
    }
  };

  const deleteSaveTool = async (email: string, toolName: string) => {
    error.value = null;

    try {
      const response = await $fetch(`/api/tool/saves/${email}`, {
        method: 'DELETE',
        body: { toolName },
      });
      return response;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : 'Failed to delete saved tool.';
      throw error.value;
    }
  };

  const getSaveTool = async (email: string) => {
    error.value = null;

    try {
      const response = await $fetch(`/api/tool/saves/${email}`, {
        method: 'GET',
      });
      return response;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : 'Failed to fetch saved tools.';
      throw error.value;
    }
  };

  return {
    postSaveTool,
    deleteSaveTool,
    getSaveTool,
  };
};
