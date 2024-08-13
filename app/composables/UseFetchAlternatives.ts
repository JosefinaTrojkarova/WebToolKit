// Composable function to fetch alternatives
// Used in: pages/tool/[name]/index.vue

export function useFetchAlternatives(toolData: Ref<Tool | null>) {
  const alternatives = ref<Alternative[]>([]);
  const mainTool = ref<Tool | null>(null);

  // Function to fetch alternatives
  const fetchAlternatives = async () => {
    if (
      toolData.value &&
      toolData.value.alternatives &&
      toolData.value.alternatives.length > 0
    ) {
      // Make API call
      const { data, error } = await useFetch('/api/tool/alternatives', {
        method: 'POST',
        body: {
          mainToolId: toolData.value._id,
          alternativeIds: toolData.value.alternatives,
        },
      });

      if (error.value) {
        console.error('Failed to fetch alternatives:', error.value);
        return;
      }

      // Update state with fetched data
      if (data.value) {
        mainTool.value = data.value.mainTool;
        alternatives.value = data.value.alternatives || [];
      }
    }
  };

  // Watch for changes in toolData and fetch alternatives
  watchEffect(() => {
    fetchAlternatives();
  });

  // Function to retry fetching
  const retryFetch = () => {
    fetchAlternatives();
  };

  return {
    alternatives,
    mainTool,
    retryFetch,
  };
}
