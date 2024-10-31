// Composable function to fetch tool data

export function useFetchToolData(name: string) {
  const { getCachedData, setCachedData } = useCache(); // useCache composable
  const cacheKey = `tool-${name}`; // key for caching explore data

  // Fetch specific tool data and cache it
  const { data, error, refresh } = useFetch<ToolMain>(`/api/tool/${name}`, {
    key: cacheKey,
    getCachedData: () => getCachedData(cacheKey),
    onResponse: ({ response }) => {
      if (response.ok) {
        setCachedData(cacheKey, response._data);
      }
    },
    onRequestError: ({ error }) => {
      console.error('Error fetching tool data:', error);
    },
  });

  const retryFetch = () => {
    refresh();
  };

  return {
    data,
    error,
    retryFetch,
  };
}
