<template>
  <div>
    <header>
      <input v-model="searchQuery" type="text" placeholder="Search for tools" />
    </header>
    <main>
      <!-- Loading -->
      <p v-if="status === 'pending'">Loading...</p>

      <!-- Error -->
      <div v-else-if="error">
        <p>Error: {{ error.message }}</p>
        <button @click="retry">Retry</button>
      </div>

      <!-- Data loaded -->
      <template v-else-if="data">
        <!-- Display a list of tools -->
        <NuxtLink v-for="item in filteredData" :key="item._id"
          :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`" class="card">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </NuxtLink>

        <!-- Display a message if no tools are found -->
        <p v-if="filteredData.length === 0">No tools found.</p>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ItemBasicInfo } from '~/types/types'

const { data, status, error, refresh } = useLazyFetch<ItemBasicInfo[]>('/api/data?explore=true')

const retry = () => {
  refresh()
}

// Search for tools - Temporary
const searchQuery = ref('')
const filteredData = computed(() => {
  if (!data.value) return []
  return data.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style lang="scss" scoped>
/* Temporary style */
.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>