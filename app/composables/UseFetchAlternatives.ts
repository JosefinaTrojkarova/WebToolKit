// Composable function to fetch alternatives
// Used in: pages/tool/[name]/index.vue and pages/tool/[name]/alternatives.vue

export function useFetchAlternatives(providedToolData?: Ref<Tool | null>) {
  const alternatives = ref<Alternative[]>([]);
  const mainTool = ref<Tool | null>(null);
  const error = ref<Error | null>(null);
  const route = useRoute();
  const toolName = route.params.name;

  const fetchAlternatives = async () => {
    let toolData: Tool | null = null;

    if (providedToolData) {
      toolData = providedToolData.value;
    } else if (toolName) {
      // Fetch tool data if providedToolData is not available
      try {
        toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { alternativesOnly: 'true' },
        });
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return; // Exit early if tool data cannot be fetched
      }
    }

    if (
      toolData &&
      toolData._id &&
      toolData.alternatives &&
      toolData.alternatives.length > 0
    ) {
      try {
        // Fetch alternatives using the tool data
        const response = await $fetch('/api/tool/alternatives', {
          method: 'POST',
          body: {
            mainToolId: toolData._id,
            alternativeIds: toolData.alternatives,
          },
        });

        if (response) {
          mainTool.value = response.mainTool;
          alternatives.value = response.alternatives || [];
        }
      } catch (e) {
        console.error('Error fetching alternatives:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    } else {
      error.value = new Error('Tool data is incomplete or has no alternatives');
    }
  };

  const stopWatch = watchEffect(() => {
    fetchAlternatives();
  });

  const retryFetch = () => {
    fetchAlternatives();
  };

  onUnmounted(() => {
    stopWatch();
  });

  return {
    alternatives,
    mainTool,
    error,
    retryFetch,
  };
}
