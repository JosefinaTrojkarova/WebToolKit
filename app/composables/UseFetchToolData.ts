export function useFetchToolData(name: string) {
  const { data, error, refresh } = useFetch<Tool>(`/api/tool/${name}`, {
    key: `tool-${name}`,
    default: () => ({ alternatives: [], _id: '' }),
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
