// Composable function made specifically for pages/explore.vue

export function useExplore() {
  const categories = useState<Category[]>('categories', () => []) // list of all categories fetched from the server

  const activeCategories = ref<string[]>([]) // currently selected categories
  const activeTags = ref<string[]>([]) // currently selected tags
  const searchQuery = ref('') //  current search query

  const { getCachedData, setCachedData } = useCache() // useCache composable
  const cacheKey = 'explore-data' // key for caching explore data
  const categoriesCacheKey = 'categories-data' // key for caching categories data

  // Fetch categories and cache
  const {
    error: categoriesError,
    refresh: refreshCategories,
    status: categoriesStatus,
  } = useFetch<CategoryDatabase[]>('/api/tool/categories', {
    key: categoriesCacheKey,
    transform: (response) =>
      response?.map((category: any) => ({ ...category, active: false })) || [],
    getCachedData: () => getCachedData(categoriesCacheKey),
    onResponse: ({ response }) => {
      if (response.ok) {
        categories.value = response._data
        setCachedData(categoriesCacheKey, response._data)
      }
    },
    onRequestError: ({ error }) => {
      console.error('Error fetching categories:', error)
    },
  })

  // Handle category toggle
  const handleCategoryToggle = (category: Category) => {
    if (category.active) {
      activeCategories.value.push(category.name) // add a category
    } else {
      activeCategories.value = activeCategories.value.filter(
        // remove a category
        (c) => c !== category.name
      )
    }
  }

  // Handle tag toggle
  const handleTagToggle = (event: { variant: string; tag: Tag }) => {
    const tagName = `${event.variant}:${event.tag.name}`
    if (!activeTags.value.includes(tagName)) {
      activeTags.value = [...activeTags.value, tagName] // add a tag
    } else {
      activeTags.value = activeTags.value.filter((t) => t !== tagName) // remove a tag
    }
  }

  // Fetch explore data based on the current search query, categories, and tags
  const { data, error, status, refresh } = useFetch<ItemBasicInfo[]>(
    () => {
      const searchParam = searchQuery.value
        ? `&search=${encodeURIComponent(searchQuery.value)}`
        : ''
      return `/api/data?explore=true${searchParam}`
    },
    {
      key: cacheKey,
      getCachedData: () => getCachedData(cacheKey),
      transform: (response) => {
        if (!response) return []
        setCachedData(cacheKey, response)
        return response
      },
      default: () => [], // Provide default empty array
    }
  )

  // Computed property to check categories and tags filter
  const filteredTools = computed(() => {
    if (!data.value || status.value === 'pending') return []

    return data.value.filter((tool) => {
      // Check if tool matches selected categories
      const categoryMatch =
        activeCategories.value.length === 0 ||
        activeCategories.value.every(
          (
            category // match only if all selected categories match
          ) => tool.categories.includes(category)
        )

      // Check if tool matches selected pricing tags
      const pricingTags = activeTags.value
        .filter((tag) => tag.startsWith('pricing:'))
        .map((tag) => tag.split(':')[1]) // Extract tag names

      const pricingTagMatch =
        pricingTags.length === 0 ||
        pricingTags.some((tagName) => tool.tags.pricing.includes(tagName))

      // Check if tool matches selected licensing tags
      const licensingTags = activeTags.value
        .filter((tag) => tag.startsWith('licensing:'))
        .map((tag) => tag.split(':')[1]) // Extract tag names

      const licensingTagMatch =
        licensingTags.length === 0 ||
        licensingTags.some((tagName) => tool.tags.licensing.includes(tagName))

      // Check if tool matches selected rating tags
      const ratingTags = activeTags.value
        .filter((tag) => tag.startsWith('rating:'))
        .map((tag) => {
          const parts = tag.split(':')
          return parts[1] !== undefined ? parseFloat(parts[1]) : NaN
        }) // Extract tag names + Convert tag names to numbers

      const ratingTagMatch =
        ratingTags.length === 0 ||
        ratingTags.some(
          (tagValue) => Math.abs(tool.rating.stars - tagValue) <= 0.5
        ) // Compare with 0.5 tolerance

      // Return true if all tag matches are satisfied
      return (
        categoryMatch && pricingTagMatch && licensingTagMatch && ratingTagMatch
      )
    })
  })

  const hasShownError = ref(false)

  watch(
    [error, categoriesError],
    ([newError, newCategoriesError]) => {
      if ((newError || newCategoriesError) && !hasShownError.value) {
        console.error('Error occurred:', {
          exploreError: newError,
          categoriesError: newCategoriesError,
        })
        hasShownError.value = true
        alert('Failed to load data. Please refresh the page.')
      } else if (!newError && !newCategoriesError) {
        hasShownError.value = false
      }
    },
    { immediate: false }
  )

  const retryFetch = async () => {
    hasShownError.value = false
    setCachedData(cacheKey, null)
    setCachedData(categoriesCacheKey, null)

    try {
      await Promise.all([refreshCategories(), refresh()])

      // Check the status after refresh
      if (status.value === 'error' || categoriesStatus.value === 'error') {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Retry failed:', error)
      hasShownError.value = true
    }
  }

  // Combined loading state
  const isLoading = computed(
    () => status.value === 'pending' || categoriesStatus.value === 'pending'
  )

  return {
    categories,
    searchQuery,
    refreshCategories,
    handleCategoryToggle,
    handleTagToggle,
    error,
    filteredTools,
    retryFetch,
    status: isLoading, // Use combined loading state
    data,
  }
}
