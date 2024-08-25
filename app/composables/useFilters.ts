// UNFINISHED COMPOSABLE FUNCTION FOR FILTERS!!!!!! - not working on reviews page yet

export function useFilters(alternatives: Ref<any[]>) {
  // State to manage selected filters
  const selectedFilters = ref<Record<string, any>>({
    categories: [],
    pricing: [],
    licensing: [],
    rating: [] as number[], // Rating is an array of numbers
  });

  // Function to handle filter toggle
  const handleFilterToggle = (filter: { type: string; value: any }) => {
    const { type, value } = filter;

    if (type === 'rating') {
      const index = selectedFilters.value.rating.indexOf(value);
      if (index === -1) {
        selectedFilters.value.rating.push(value);
      } else {
        selectedFilters.value.rating.splice(index, 1);
      }
    } else if (['categories', 'pricing', 'licensing'].includes(type)) {
      if (!Array.isArray(selectedFilters.value[type])) {
        selectedFilters.value[type] = [];
      }
      const index = selectedFilters.value[type].indexOf(value);
      if (index === -1) {
        selectedFilters.value[type].push(value);
      } else {
        selectedFilters.value[type].splice(index, 1);
      }
    }
  };

  // Computed property to filter the alternatives based on selected filters
  const filteredAlternatives = computed(() => {
    return alternatives.value.filter((alternative: Alternative) => {
      const isRatingMatch =
        selectedFilters.value.rating.length === 0 ||
        selectedFilters.value.rating.some(
          (selectedRating: number) =>
            Math.abs(alternative.rating.stars - selectedRating) <= 0.5
        );

      return (
        (selectedFilters.value.categories.length === 0 ||
          selectedFilters.value.categories.some((cat: any) =>
            alternative.categories.includes(cat)
          )) &&
        (selectedFilters.value.pricing.length === 0 ||
          selectedFilters.value.pricing.includes(alternative.tags.pricing)) &&
        (selectedFilters.value.licensing.length === 0 ||
          selectedFilters.value.licensing.includes(
            alternative.tags.licensing
          )) &&
        isRatingMatch
      );
    });
  });

  // Return the reactive properties and methods for use in components
  return {
    handleFilterToggle,
    filteredAlternatives,
  };
}
