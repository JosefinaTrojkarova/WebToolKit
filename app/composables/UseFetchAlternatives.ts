// Composable function to fetch alternatives
// Used in: pages/tool/[name]/index.vue

export function useFetchAlternatives(toolData: Ref<Tool | null>) {
  const alternatives = useState<Alternative[]>('alternatives', () => []);
  const mainTool = useState<Tool | null>('mainTool', () => null);

  const fetchAlternatives = async () => {
    if (
      toolData.value &&
      toolData.value.alternatives &&
      toolData.value.alternatives.length > 0
    ) {
      try {
        const response = await $fetch('/api/tool/alternatives', {
          method: 'POST',
          body: {
            mainToolId: toolData.value._id,
            alternativeIds: toolData.value.alternatives,
          },
        });

        if (response) {
          mainTool.value = response.mainTool;
          alternatives.value = response.alternatives || [];
        }
      } catch (error) {
        console.error('Error fetching alternatives:', error);
        throw error;
      }
    }
  };

  // Watch for changes in toolData and fetch alternatives
  const stopWatch = watchEffect(() => {
    fetchAlternatives();
  });

  // Function to retry fetching
  const retryFetch = () => {
    return fetchAlternatives();
  };

  onUnmounted(() => {
    stopWatch();
  });

  return {
    alternatives,
    mainTool,
    retryFetch,
  };
}
