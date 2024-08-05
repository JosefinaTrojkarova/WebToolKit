// Composable for app\pages\explore.vue

export function useExplore() {
  const categories = useState<Category[]>('categories', () => []); // list of all categories fetched from the server
  const activeCategories = ref<string[]>([]); // currently selected categories
  const activeTags = ref<string[]>([]); // currently selected tags
  const searchQuery = ref(''); //  current search query
  const nuxtApp = useNuxtApp(); // nuxt application instance for accessing nuxt caching
  const cacheKey = 'explore-data'; // key for caching explore data

  // Fetch categories
  const { error: categoriesError, refresh: refreshCategories } = useFetch<
    CategoryDatabase[]
  >('/api/tool/categories', {
    transform: (response) =>
      response.map((category: any) => ({ ...category, active: false })),
    onResponse: ({ response }) => {
      if (response.ok) {
        categories.value = response._data;
      }
    },
    onRequestError: ({ error }) => {
      console.error('Error fetching categories:', error);
    },
  });

  // Handle category toggle
  const handleCategoryToggle = (category: Category) => {
    if (category.active) {
      activeCategories.value.push(category.name); // add a category
    } else {
      activeCategories.value = activeCategories.value.filter(
        // remove a category
        (c) => c !== category.name
      );
    }
  };

  // Handle tag toggle
  const handleTagToggle = (event: { variant: string; tag: Tag }) => {
    const tagName = `${event.variant}:${event.tag.name}`;
    if (!activeTags.value.includes(tagName)) {
      activeTags.value = [...activeTags.value, tagName]; // add a tag
    } else {
      activeTags.value = activeTags.value.filter((t) => t !== tagName); // remove a tag
    }
  };

  // Fetch explore data based on the current search query, categories, and tags
  const { data, error } = useFetch<ItemBasicInfo[]>(
    () => {
      const searchParam = searchQuery.value
        ? `&search=${encodeURIComponent(searchQuery.value)}`
        : '';
      return `/api/data?explore=true${searchParam}`;
    },
    {
      // caching data
      key: cacheKey,
      getCachedData: (key) => {
        try {
          if (nuxtApp.isHydrating && nuxtApp.payload?.data?.[key]) {
            return nuxtApp.payload.data[key];
          }
          if (nuxtApp.static?.data?.[key]) {
            return nuxtApp.static.data[key];
          }
        } catch (err) {
          console.error(`Error retrieving cached data for key ${key}:`, err);
        }
        return null;
      },
      transform: (response) => {
        try {
          if (nuxtApp.static?.data) {
            nuxtApp.static.data[cacheKey] = response;
          }
        } catch (err) {
          console.error(`Error caching data for key ${cacheKey}:`, err);
        }
        return response;
      },
    }
  );

  // Computed property to check categories and tags filter
  const filteredTools = computed(() => {
    if (!data.value) return [];

    return data.value.filter((tool) => {
      // Check if tool matches selected categories
      const categoryMatch =
        activeCategories.value.length === 0 ||
        activeCategories.value.every(
          (
            category // match only if all selected categories match
          ) => tool.categories.includes(category)
        );

      // Check if tool matches selected pricing tags
      const pricingTags = activeTags.value
        .filter((tag) => tag.startsWith('pricing:'))
        .map((tag) => tag.split(':')[1]); // Extract tag names

      const pricingTagMatch =
        pricingTags.length === 0 ||
        pricingTags.some((tagName) => tool.tags.pricing?.includes(tagName));

      // Check if tool matches selected licensing tags
      const licensingTags = activeTags.value
        .filter((tag) => tag.startsWith('licensing:'))
        .map((tag) => tag.split(':')[1]); // Extract tag names

      const licensingTagMatch =
        licensingTags.length === 0 ||
        licensingTags.some((tagName) => tool.tags.licensing?.includes(tagName));

      // Check if tool matches selected rating tags
      const ratingTags = activeTags.value
        .filter((tag) => tag.startsWith('rating:'))
        .map((tag) => {
          const parts = tag.split(':');
          return parts[1] !== undefined ? parseFloat(parts[1]) : NaN;
        }); // Extract tag names + Convert tag names to numbers

      const ratingTagMatch =
        ratingTags.length === 0 ||
        ratingTags.some(
          (tagValue) => Math.abs(tool.rating.stars - tagValue) <= 0.5
        ); // Compare with 0.5 tolerance

      // Return true if all tag matches are satisfied
      return (
        categoryMatch && pricingTagMatch && licensingTagMatch && ratingTagMatch
      );
    });
  });

  // Watch for errors
  watch(error, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      alert('Failed to fetch explore data. Please try again later.');
    }
  });

  watch(categoriesError, (err) => {
    if (err) {
      console.error('An error occurred while fetching categories:', err);
      alert('Failed to fetch categories. Please try again later.');
    }
  });

  return {
    categories,
    searchQuery,
    refreshCategories,
    handleCategoryToggle,
    handleTagToggle,
    error,
    filteredTools,
  };
}
