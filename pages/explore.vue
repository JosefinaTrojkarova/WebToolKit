<template>
  <div>
    <header>
      <input v-model="searchQuery" type="text" placeholder="Search for tools" />
    </header>
    <main>
      <!-- Display error state -->
      <p v-if="error">Error: {{ error.message }}</p>

      <!-- Display tools when data is available -->
      <template v-else>
        <!-- Display a list of tools -->
        <NuxtLink 
          v-for="item in filteredData" 
          :key="item._id"
          :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`" 
          class="card"
        >
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
import { ref, computed } from 'vue'

interface DataItem {
  _id: string;
  name: string;
  description: string;
}

const searchQuery = ref('')

const { data, error } = await useFetch<DataItem[]>('/api/data')

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