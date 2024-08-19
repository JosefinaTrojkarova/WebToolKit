// Composable function to fetch alternatives for a given tool
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

  // Function to fetch alternatives based on the provided tool ID and alternative IDs
  const fetchAlternatives = async (amount = initialAmount) => {
    // If toolId and alternativeIds are provided, fetch alternatives using them
    if (toolId && alternativeIds) {
      try {
        // Fetch alternatives using the provided toolId and alternativeIds
        const response = await $fetch('/api/tool/alternatives', {
          method: 'POST',
          body: {
            mainToolId: toolId,
            alternativeIds: alternativeIds,
            amount: amount ?? undefined, // Pass the amount if provided
          },
        });

        if (response) {
          mainTool.value = response.mainTool; // Set the main tool data
          alternatives.value = response.alternatives || []; // Set the list of alternatives
        }
      } catch (e) {
        // Log and set the error if fetching alternatives fails
        console.error('Error fetching alternatives:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    } else {
      // If toolId or alternativeIds are missing, fetch tool data based on route parameter
      const route = useRoute();
      const toolName = route.params.name as string;

      try {
        // Fetch tool data if toolId and alternativeIds are not provided
        const toolData = await $fetch<Tool>(`/api/tool/${toolName}`, {
          params: { alternativesOnly: 'true' },
        });

        if (
          toolData &&
          toolData._id &&
          toolData.alternatives &&
          toolData.alternatives.length > 0
        ) {
          try {
            // Fetch alternatives using the fetched tool data
            const response = await $fetch('/api/tool/alternatives', {
              method: 'POST',
              body: {
                mainToolId: toolData._id,
                alternativeIds: toolData.alternatives,
                amount: amount ?? undefined, // Pass the amount if provided
              },
            });

            if (response) {
              mainTool.value = response.mainTool; // Set the main tool data
              alternatives.value = response.alternatives || []; // Set the list of alternatives
            }
          } catch (e) {
            // Log and set the error if fetching alternatives fails
            console.error('Error fetching alternatives:', e);
            error.value =
              e instanceof Error ? e : new Error('Unknown error occurred');
          }
        } else {
          error.value = new Error(
            'Tool data is incomplete or has no alternatives'
          );
        }
      } catch (e) {
        // Log and set the error if fetching tool data fails
        console.error('Failed to fetch tool data:', e);
        error.value =
          e instanceof Error ? e : new Error('Unknown error occurred');
      }
    }
  };

  // Watch effect to trigger fetching alternatives when dependencies change
  const stopWatch = watchEffect(() => {
    fetchAlternatives();
  });

  // Function to retry fetching alternatives
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
