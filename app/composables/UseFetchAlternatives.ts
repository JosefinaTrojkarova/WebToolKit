export function useFetchAlternatives(toolData: Ref<Tool | null>) {
  const alternatives = ref<Alternative[]>([]);

  const fetchAlternatives = async () => {
    if (toolData.value && toolData.value.alternatives.length > 0) {
      try {
        const { data: altData, error } = await useFetch<Alternative[]>(
          '/api/tool/alternatives',
          {
            method: 'POST',
            body: { ids: toolData.value.alternatives },
          }
        );
        if (error.value) throw error.value;
        alternatives.value = altData.value || [];
      } catch (e) {
        console.error('Failed to fetch alternatives:', e);
      }
    }
  };

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
