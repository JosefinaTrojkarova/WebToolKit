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
        <ToolCard v-if="mainTool" :data="mainTool" :main="true"/>
      </div>
      <div class="alternatives-wrapper">
        <Filters type="alternatives" :trigger="360" @filter-toggled="handleFilterToggle" style="z-index: 100;"/>
        <div class="alternatives">
          <ToolCard v-for="alt in filteredAlternatives" :key="alt._id" :data="alt"/>
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
const {alternatives, mainTool, error: alternativesError, retryFetch} = useFetchAlternatives();

// Fiter
const filterConfig: any = {
  categories: (alt: Alternative, selected: string[]) => selected.some((cat: Category) => alt.categories.includes(cat)),
  pricing: (alt: Alternative, selected: string[]) => selected.includes(alt.tags.pricing),
  licensing: (alt: Alternative, selected: string[]) => selected.includes(alt.tags.licensing),
  rating: (alt: Alternative, selected: number[]) => selected.some((rating: number) => Math.abs(alt.rating.stars - rating) <= 0.5),
};
const {handleFilterToggle, filteredItems: filteredAlternatives} = useFilters(alternatives, filterConfig);

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

  .main-tool {
    position: sticky;
    top: $xxl + $xxl + $m;
    flex: 1;
    height: min-content;
    margin-top: $xxl + $xl;
  }

  .alternatives-wrapper {
    flex: 3;
    display: flex;
    flex-direction: column;

    .alternatives {
      display: grid;
      grid-template-columns: repeat(3, minmax(300px, 1fr));
      gap: $m;
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