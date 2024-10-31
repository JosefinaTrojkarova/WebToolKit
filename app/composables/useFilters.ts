// Composable function fro categories and tags on tool side pages

export function useFilters(items: Ref<any[]>, filterConfig: any) {
  // State to manage selected filters
  const selectedFilters = ref<Record<string, any>>({});

  // Initialize selectedFilters based on filterConfig
  Object.keys(filterConfig).forEach((key) => {
    selectedFilters.value[key] = [];
  });

  // Function to handle filter toggle
  const handleFilterToggle = (filter: { type: string; value: any }) => {
    const { type, value } = filter;

    if (!Array.isArray(selectedFilters.value[type])) {
      selectedFilters.value[type] = [];
    }

    const index = selectedFilters.value[type].indexOf(value);
    if (index === -1) {
      selectedFilters.value[type].push(value);
    } else {
      selectedFilters.value[type].splice(index, 1);
    }
  };

  // Computed property to filter the items based on selected filters
  const filteredItems = computed(() => {
    return items.value.filter((item: any) => {
      return Object.keys(filterConfig).every((filterType) => {
        if (selectedFilters.value[filterType].length === 0) return true;
        const filterFunction = filterConfig[filterType];
        if (filterFunction) {
          return filterFunction(item, selectedFilters.value[filterType]);
        } else {
          return true;
        }
      });
    });
  });

  // Return the reactive properties and methods for use in components
  return {
    handleFilterToggle,
    filteredItems,
  };
}
