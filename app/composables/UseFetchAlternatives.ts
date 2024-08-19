// Composable function to fetch alternatives
// Used in: pages/tool/[name]/index.vue and pages/tool/[name]/alternatives.vue

export function useFetchAlternatives(
  toolId?: string,
  alternativeIds?: string[],
  initialAmount?: number
) {
  // Reactive state to hold the fetched alternatives, main tool, and any errors that occur
  const alternatives = ref<Alternative[]>([]);
  const mainTool = ref<Tool | null>(null);
  const error = ref<Error | null>(null);

  // Function to fetch alternatives
  const fetchAlternatives = async (amount = initialAmount) => {
    // If toolId is not provided -> fetch it based on the name
    if (!toolId) {
      // Get toolName from the URL if toolId is not provided
      const route = useRoute();
      const toolName = route.params.name as string;

      // Fetch tool data to get toolId if it's not provided
      try {
        const toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { alternativesOnly: 'true' },
        });
        toolId = toolData._id; // Assign the fetched toolId
        alternativeIds = toolData.alternatives || []; // Assign alternativeIds from fetched tool data
      } catch (e) {
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
        return;
      }
    }

    // If toolId is available or we fetched it -> fetch alternatives for the tool
    if (toolId && alternativeIds) {
      try {
        const params: any = { mainToolId: toolId };
        if (alternativeIds.length > 0) {
          params.alternativeIds = alternativeIds; // Apply alternativeIds if provided
        }
        if (amount !== undefined) {
          params.amount = amount; // Apply amount if provided
        }
        // Fetch alternatives from the API
        const response = await $fetch('/api/tool/alternatives', {
          method: 'POST',
          body: params,
        });
        mainTool.value = response.mainTool || null; // Set the main tool data or null if no data
        alternatives.value = response.alternatives || []; // Set fetched alternatives or an empty array if no data
      } catch (e) {
        console.error('Error fetching alternatives:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    } else {
      error.value = new Error('Tool ID or alternative IDs are missing');
    }
  };

  // Watch effect to automatically trigger fetching whenever the reactive dependencies change
  const stopWatch = watchEffect(() => {
    fetchAlternatives();
  });

  // Function to retry fetching
  const retryFetch = (amount?: number) => {
    fetchAlternatives(amount);
  };

  // Cleanup watcher on component unmount
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
