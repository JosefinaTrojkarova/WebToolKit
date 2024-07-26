<template>
  <div class="explore">
    <header class="header">
      <h2 class="header__title">Explore</h2>
    </header>
    <main class="explore__main">
      <aside class="aside">
        <div class="search-container">
          <Icon class="search-icon" name="material-symbols:search-rounded" size="24" />
          <input class="field--search aside__search" v-model="searchQuery" type="text" placeholder="Search for tools"
            @input="performSearch" />
        </div>
        <div class="aside__filters">
          <div class="filters filters__categories">
            <h4 class="filters__heading">Categories</h4>
            <ul class="list categories__list">

            </ul>
          </div>
          <div class="filters filters__tags">
            <h4 class="filters__heading">Tags</h4>
            <p>Pricing</p>
            <ul class="list pricing__list">

            </ul>
            <p>Licensing</p>
            <ul class="list licensing__list">

            </ul>
            <p>Rating</p>
            <ul class="list rating__list">

            </ul>
          </div>
        </div>
      </aside>
      <section class="section tools">
        <!-- Loading, <p v-if="status === 'pending'">Loading...</p> add status in LazyFetch-->
        <!-- Error -->
        <div class="error" v-if="error">
          <p class="error__message">Error: {{ error.message }}</p>
          <button class="btn error__btn--retry" @click="performSearch">Retry</button>
          <!-- change classes -->
        </div>
        <!-- Data loaded -->
        <div class="tools__list" v-else-if="data">
          <!-- Display a list of tools -->
          <ToolCardExplore v-for="item in data" :key="item._id" :item="item" />

          <!-- Display a message if no tools are found -->
          <p v-if="data.length === 0">No tools found.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ItemBasicInfo } from '~/types/types'

// Frontend

// Backend
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
.explore {
  margin: $xxl;
}

.header {
  width: 100%;
  margin-bottom: $xxl;
}

.explore__main {
  display: flex;
  gap: $xxl;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: $m;
  width: 25.75rem;

  .aside__search {
    box-sizing: border-box;
    height: 3.5rem;
  }

  .aside__filters {
    display: flex;
    gap: $m;

    .filters {
      display: flex;
      flex-direction: column;
      gap: $s;

      width: 100%;
      padding: $xl;
      border: 1px solid $primary-200;
      border-radius: $m;
    }
  }
}

.section {
  width: 88.25rem;

  .tools__list {
    display: grid;
    gap: $m;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>