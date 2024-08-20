<template>
  <NuxtLayout name="tool">
    <section v-if="error">
      <p>Error: {{ error?.message }}</p>
      <button @click="retryFetch">Retry</button>
    </section>
    <section v-else-if="isMounted && data" class="resources">
      <h3>Resources</h3>
      <div v-if="data?.resources?.length" class="resources-wrapper">
        <ResourceCard v-for="(resource, index) in data.resources" :key="index" :link="resource.link"
          :type="resource.type">
        </ResourceCard>
      </div>
      <p v-else>No resources available.</p>
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
// Hydration mismatch prevention
// Not sure if it's needed here on resources page, added it to make sure
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
onUnmounted(() => {
  isMounted.value = false
})

const route = useRoute()
const { name } = route.params

const { data, error, refresh } = await useFetch<Resources>(`/api/tool/${name}`, {
  params: { resourcesOnly: 'true' },
});
const retryFetch = () => {
  refresh()
}
</script>

<style scoped lang="scss">
.resources {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: $m;

  .resources-wrapper {
    display: grid;
    grid-template-columns: repeat(5, minmax(20rem, 1fr));
    width: 100%;
    height: 30rem;
    gap: $m;
  }
}
</style>