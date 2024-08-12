export function useFetchAlternatives(toolData: Ref<Tool | null>) {
  const alternatives = ref<Alternative[]>([]);

  const fetchAlternatives = async () => {
    // Check if toolData exists and has alternatives
    if (
      toolData.value &&
      toolData.value.alternatives &&
      toolData.value.alternatives.length > 0
    ) {
      const { data, error } = await useFetch('/api/tool/alternatives', {
        method: 'POST',
        body: { ids: toolData.value.alternatives },
      });

      if (error.value) {
        console.error('Failed to fetch alternatives:', error.value);
        return;
      }

      // Update alternatives with fetched data
      alternatives.value = data.value || [];
    }
  };

  // Fetch the alternatives when toolData changes
  watchEffect(() => {
    fetchAlternatives();
  });

  const retryFetch = () => {
    fetchAlternatives();
  };

  return {
    alternatives,
    retryFetch,
  };
}
