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
              <Categories :categories="myCategories" @category-toggled="handleCategoryToggle" />
            </ul>
          </div>
          <div class="filters filters__tags">
            <h4 class="filters__heading">Tags</h4>
            <p>Pricing</p>
            <ul class="list pricing__list">
              <Tags :tags="pricingTags" variant="pricing" @tag-toggled="handleTagToggle" />
            </ul>
            <p>Licensing</p>
            <ul class="list licensing__list">
              <Tags :tags="licensingTags" variant="licensing" @tag-toggled="handleTagToggle" />
            </ul>
            <p>Rating</p>
            <ul class="list rating__list">
              <Tags :tags="ratingTags" variant="rating" @tag-toggled="handleTagToggle" />
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
import type { ItemBasicInfo, Category, Tag } from '~/types/types'

// Categories and Tags data
const myCategories = ref<Category[]>([
  { id: 1, name: 'UI Design', active: false },
  { id: 2, name: 'UX Design', active: false },
  { id: 3, name: 'Prototyping', active: false },
  { id: 4, name: 'JavaScript', active: false },
  { id: 5, name: 'TypeScript', active: false },
  { id: 6, name: 'Python', active: false },
  { id: 7, name: 'Framework', active: false },
  { id: 8, name: 'CSS', active: false },
  { id: 9, name: 'Hosting', active: false },
  { id: 10, name: 'Compiling', active: false },
  { id: 11, name: 'HTML', active: false }
])

const handleCategoryToggle = () => {
  refresh()
}

const pricingTags = ref<Tag[]>([
  { id: 1, name: '100% Free', active: false },
  { id: 2, name: 'Free Version', active: false },
  { id: 3, name: 'Free Trial', active: false },
  { id: 4, name: 'Paid', active: false }
])

const licensingTags = ref<Tag[]>([
  { id: 1, name: 'Open Source', active: false },
  { id: 2, name: 'Proprietary', active: false }
])

const ratingTags = ref<Tag[]>([
  { id: 1, name: '5', active: false },
  { id: 2, name: '4', active: false },
  { id: 3, name: '3', active: false },
  { id: 4, name: '2', active: false },
  { id: 5, name: '1', active: false }
])

const handleTagToggle = () => {
  refresh()
}

const searchQuery = ref('')

const { data, error, refresh } = useFetch<ItemBasicInfo[]>(() => {
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
