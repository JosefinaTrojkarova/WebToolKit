<template>
  <div>
    <header>
      <input v-model="searchQuery" type="text" placeholder="Search for tools" @input="debouncedSearch" />
    </header>
    <main>
      <!-- Loading -->
      <p v-if="status === 'pending'">Loading...</p>

      <!-- Error -->
      <div v-else-if="error">
        <p>Error: {{ error.message }}</p>
        <button @click="() => refresh()">Retry</button>
      </div>

      <!-- Data loaded -->
      <template v-else-if="data">
        <!-- Display a list of tools -->
        <NuxtLink v-for="item in data" :key="item._id" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`"
          class="card">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </NuxtLink>

        <!-- Display a message if no tools are found -->
        <p v-if="data.length === 0">No tools found.</p>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ItemBasicInfo } from '~/types/types'

const searchQuery = ref('')

const { data, status, error, refresh } = useLazyFetch<ItemBasicInfo[]>(() => {
  const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : ''
  const url = `/api/data?explore=true${searchParam}`
  return url
}, {
  watch: [searchQuery],
  immediate: true,
})

const debouncedSearch = useDebounceFn(() => {
  console.log('Debounced search with query:', searchQuery.value)
  refresh()
}, 300)
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