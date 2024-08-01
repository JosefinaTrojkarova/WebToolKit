<template>
  <div>
    <header v-if="headerData">
      <h3>{{ headerData.name }}</h3>
      <NuxtLink :to="`/tool/${headerData.name}`">Overview</NuxtLink>
      <NuxtLink :to="`/tool/${headerData.name}/reviews`">Reviews</NuxtLink>
      <NuxtLink :to="`/tool/${headerData.name}/alternatives`">Alternatives</NuxtLink>
      <NuxtLink :to="`/tool/${headerData.name}/resources`">Resources</NuxtLink>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { headerData, fetchHeaderData } = useToolHeaderData()

// Fetch header data when the layout is created
onMounted(() => {
  if (route.params.name) {
    fetchHeaderData()
  }
})

// Re-fetch when the route changes
watch(() => route.params.name, (newName) => {
  if (newName) {
    fetchHeaderData()
  }
})
</script>

<style scoped lang="scss"></style>