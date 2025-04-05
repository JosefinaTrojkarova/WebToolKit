<template>
  <NuxtLayout name="tool">
    <!-- Error state -->
    <div v-if="alternativesError">
      <p>Error: {{ alternativesError.message }}</p>
      <button @click="handleRetryFetch">Retry</button>
    </div>
    <!-- Working state -->
    <main v-else-if="isMounted && alternatives">
      <div class="main-tool">
        <ToolCard v-if="mainTool" :data="mainTool" :main="true" />
      </div>
      <div class="alternatives-wrapper">
        <Filters type="alternatives" :trigger="360" @filter-toggled="handleFilterChange"
          @sort-changed="handleSortChange" class="alternatives-filter" />
        <div class="alternatives">
          <ToolCard v-for="alt in filteredAlternatives" :key="alt._id" :data="alt" />
        </div>
      </div>
    </main>
    <!-- Loading state -->
    <div v-else class="loading">
      <h4>One moment please...</h4>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
// Hydration mismatch prevention
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
onUnmounted(() => {
  isMounted.value = false
})

// Data fetching
const { alternatives, mainTool, error: alternativesError, retryFetch } = useFetchAlternatives();

// Fiter
const filterConfig = {
  pricing: (alt: Alternative, selected: string[]) =>
    selected.length === 0 || selected.includes(alt.tags.pricing),
  licensing: (alt: Alternative, selected: string[]) =>
    selected.length === 0 || selected.includes(alt.tags.licensing),
  rating: (alt: Alternative, selected: number[]) =>
    selected.length === 0 || selected.some((rating) => Math.abs(alt.rating.stars - rating) <= 0.5)
}

// Setup filters
const { handleFilterToggle, handleSort, filteredItems: filteredAlternatives } = useFilters(alternatives, filterConfig)

const handleFilterChange = (filter: { type: string, value: any }) => {
  handleFilterToggle(filter)
}

const handleSortChange = (sortOption: SortOption) => {
  handleSort(sortOption)
}

// Retry fetch on error
const handleRetryFetch = () => {
  retryFetch()
}
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;

  width: 100%;

  padding: 0 $xxl;
  padding-bottom: $xxl;
  gap: $xxl;
  
  @media (max-width: 1024px) {
    padding: 0 $xl;
    padding-bottom: $xl;
    gap: $xl;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 $l;
    padding-bottom: $l;
    gap: $l;
  }

  .main-tool {
    position: sticky;
    top: $xxl + $xxl + $m;
    flex: 1;
    height: min-content;
    margin-top: $xxl + $xl;
    
    @media (max-width: 768px) {
      position: relative;
      top: 0;
      margin-top: $l;
      width: 100%;
    }
  }

  .alternatives-wrapper {
    flex: 3;
    display: flex;
    flex-direction: column;

    .alternatives {
      display: grid;
      grid-template-columns: repeat(3, minmax(300px, 1fr));
      gap: $m;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, minmax(250px, 1fr));
      }
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
  }
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 80vh;
  width: 100%;
}
</style>