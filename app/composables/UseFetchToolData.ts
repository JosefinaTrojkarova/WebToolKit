export function useFetchToolData(name: string) {
  const { data, error, refresh } = useFetch<ToolMain>(
    `/api/tool/${name}`,
    {
      key: `tool-${name}`,
    }
  );

  const retryFetch = () => {
    refresh();
  };

  return {
    data,
    error,
    retryFetch,
  };
}
