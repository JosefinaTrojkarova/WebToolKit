type SortFunction = (a: any, b: any) => number

const sortFunctions: Record<SortOption, SortFunction> = {
  'Most Recent': (a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  Oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  'Highest Rated': (a, b) => b.rating.stars - a.rating.stars,
  'Lowest Rated': (a, b) => a.rating.stars - b.rating.stars,
  'A to Z': (a, b) => a.name.localeCompare(b.name),
  'Z to A': (a, b) => b.name.localeCompare(a.name),
}

export function useFilters(items: Ref<any[]>, filterConfig: any) {
  const selectedFilters = ref<Record<string, any>>({})
  const currentSort = ref<SortOption>('Most Recent')

  // Initialize selectedFilters based on filterConfig
  Object.keys(filterConfig).forEach((key) => {
    selectedFilters.value[key] = []
  })

  // Function to handle filter toggle
  const handleFilterToggle = (filter: { type: string; value: any }) => {
    const { type, value } = filter

    if (!Array.isArray(selectedFilters.value[type])) {
      selectedFilters.value[type] = []
    }

    const index = selectedFilters.value[type].indexOf(value)
    if (index === -1) {
      selectedFilters.value[type].push(value)
    } else {
      selectedFilters.value[type].splice(index, 1)
    }
  }

  // Function to handle sort changes
  const handleSort = (sortOption: SortOption) => {
    currentSort.value = sortOption
  }

  // Computed property to filter and sort items
  const filteredItems = computed(() => {
    let result = items.value.filter((item: any) => {
      return Object.keys(filterConfig).every((filterType) => {
        if (selectedFilters.value[filterType].length === 0) return true
        const filterFunction = filterConfig[filterType]
        return filterFunction
          ? filterFunction(item, selectedFilters.value[filterType])
          : true
      })
    })

    if (currentSort.value) {
      result = [...result].sort(sortFunctions[currentSort.value])
    }

    return result
  })

  return {
    handleFilterToggle,
    handleSort,
    filteredItems,
    currentSort,
  }
}
