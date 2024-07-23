<template>
  <div class="explore">
    <header class="header">
      <h2 class="header__title">Explore</h2>
      <input class=""  v-model="searchQuery" type="text" placeholder="Search for tools" @input="performSearch" />
    </header>
    <section>
      <!-- Loading, <p v-if="status === 'pending'">Loading...</p> add status in LazyFetch-->
      <!-- Error -->
      <div class="error" v-if="error">
        <p class="error__message">Error: {{ error.message }}</p>
        <button class="btn error__btn--retry" @click="performSearch">Retry</button>
      </div>
      <!-- Data loaded -->
      <div v-else-if="data">
        <!-- Display a list of tools -->
        <NuxtLink class="card" v-for="item in data" :key="item._id" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </NuxtLink>

        <!-- Display a message if no tools are found -->
        <p v-if="data.length === 0">No tools found.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ItemBasicInfo } from '~/types/types'

const searchQuery = ref('')

const { data, error, refresh } = useLazyFetch<ItemBasicInfo[]>(() => {
  const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : ''
  return `/api/data?explore=true${searchParam}`
}, {
  immediate: true,
})

const performSearch = () => {
  refresh()
}
</script>

<style lang="scss" scoped>
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