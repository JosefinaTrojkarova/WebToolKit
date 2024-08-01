export function useFetchToolData(name: string, type?: string) {
  const isHeader = type === 'header';
  const { data, error, refresh } = useFetch<ToolMain>(
    `/api/tool/${name}?header=${isHeader}`,
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
