// Fetch header data for the current tool and store it in the tool store

export const useFetchHeaderData = () => {
  const route = useRoute();
  const store = useToolStore();

  const fetchHeaderData = async () => {
    const { name } = route.params;
    if (name !== store.value.currentTool) {
      try {
        const data = await $fetch(`/api/tool/${name}?header=true`);
        store.value.headerData = data;
        store.value.currentTool = name;
      } catch (error) {
        console.error('Failed to fetch header data:', error);
      }
    }
  };

  return {
    headerData: computed(() => store.value.headerData),
    fetchHeaderData,
  };
};
