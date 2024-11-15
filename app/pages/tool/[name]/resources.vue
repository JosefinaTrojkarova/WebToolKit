<template>
  <NuxtLayout name="tool">
    <!-- Error state -->
    <!-- <div v-if="error">
      <p>Error: {{ error?.message }}</p>
      <button @click="retryFetch">Retry</button>
    </div> -->
    <!-- Working state -->
    <!-- <main v-else-if="isMounted && data">
      <div class="resource-cta">
        <p>Got any valuable videos, articles or discussions about {{ name }}? Help us by suggesting them!</p>
        <button class="btn--secondary--small">Suggest a Resource</button>
      </div>
      <div class="content-wrapper">
        <Filters type="resources" :trigger="490" @filter-toggled="handleFilterToggle" />
        <div class="content">
          <div class="from-creators">
            <div class="header">
              <h3>From the creators</h3>
              <span class="material-symbols-rounded see-all">arrow_forward</span>
            </div>
            <div v-if="data?.resources?.length" class="resources-wrapper">
              <ResourceCard v-for="(resource, index) in fromCreatorsResources.slice(0, 5)" :key="index"
                :link="resource.link" :type="resource.type">
              </ResourceCard>
            </div>
            <p v-else>No resources available.</p>
          </div>
          <div class="comparisons">
            <div class="header">
              <h3>Comparisons</h3>
              <span class="material-symbols-rounded see-all">arrow_forward</span>
            </div>
            <div v-if="data?.resources?.length" class="resources-wrapper">
              <ResourceCard v-for="(resource, index) in comparisonResources.slice(0, 5)" :key="index"
                :link="resource.link" :type="resource.type">
              </ResourceCard>
            </div>
            <p v-else>No resources available.</p>
          </div>
          <div class="news">
            <div class="header">
              <h3>News</h3>
              <span class="material-symbols-rounded see-all">arrow_forward</span>
            </div>
            <div v-if="data?.resources?.length" class="resources-wrapper">
              <ResourceCard v-for="(resource, index) in newsResources.slice(0, 5)" :key="index" :link="resource.link"
                :type="resource.type">
              </ResourceCard>
            </div>
            <p v-else>No resources available.</p>
          </div>
        </div>
      </div>
    </main> -->
    <!-- Loading state -->
    <div class="loading">
      <h4>One moment please...</h4>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
/* // Hydration mismatch prevention
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
onUnmounted(() => {
  isMounted.value = false
})

// Data fetching
const route = useRoute()
const { name } = route.params

const { data, error, refresh } = await useFetch<Resources>(`/api/tool/${name}`, {
  params: { resourcesOnly: 'true' },
});
const retryFetch = () => {
  refresh()
}

// Filter
const filterConfig: any = {
  category: (resource: Resources, selected: string[]) => selected.length === 0 || selected.includes(resource.category),
  type: (resource: Resources, selected: string[]) => selected.length === 0 || selected.includes(resource.type)
};
const { handleFilterToggle, filteredItems } = useFilters(computed(() => data.value?.resources || []), filterConfig);


// Resources categories
const newsResources = computed(() => {
  return filteredItems.value.filter((resource: Resources) => resource.category === 'News')
})

const comparisonResources = computed(() => {
  return filteredItems.value.filter((resource: Resources) => resource.category === 'Comparisons')
})

const fromCreatorsResources = computed(() => {
  return filteredItems.value.filter((resource: Resources) => resource.category === 'From the creators')
}) */
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  width: 100%;

  padding: 0 $xxl;
  gap: $xxl;

  .resource-cta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    width: 100%;

    padding: $xl;

    border: 1px solid $primary-200;
    border-radius: $m;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;

    gap: $m;

    width: 100%;

    .content {
      display: flex;
      flex-direction: column;

      gap: $xxl;

      width: 100%;

      .from-creators,
      .comparisons,
      .news {
        display: flex;
        flex-direction: column;

        gap: $m;

        width: 100%;

        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          width: 100%;

          .see-all {
            color: $primary-400;
            font-size: 1.5rem;

            cursor: pointer;
          }
        }

        .resources-wrapper {
          display: flex;
          flex-direction: row;

          gap: $m;

          width: 100%;
          height: 30rem;
        }
      }
    }
  }
}
</style>