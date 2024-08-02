<template>
  <div class="explore">
    <header class="header">
      <h2 class="header__title">Explore</h2>
    </header>
    <main class="explore__main">
      <aside class="aside">
        <label class="search-container" for="search-field">
          <span class="search-icon material-symbols-rounded">search</span>
          <input id="search-field" class="field--search aside__search" v-model="searchQuery" type="text"
            placeholder="Search for tools" @input="performSearch" />
        </label>
        <div class="aside__filters">
          <div class="filter filter--categories">
            <h4 class="filter__heading">Categories</h4>
            <ul class="filter__list">
              <Categories :categories="categories" @category-toggled="handleCategoryToggle" />
            </ul>
          </div>
          <div class="filter filter--tags">
            <h4 class="filter__heading">Tags</h4>
            <div class="filter__wrapper">
              <p>Pricing</p>
              <ul class="filter__list">
                <Tags variant="pricing" />
              </ul>
            </div>
            <div class="filter__wrapper">
              <p>Licensing</p>
              <ul class="filter__list">
                <Tags variant="licensing" />
              </ul>
            </div>
            <div class="filter__wrapper">
              <p>Rating</p>
              <ul class="filter__list">
                <Tags variant="rating" />
              </ul>
            </div>
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
// Initialize categories state using useState, providing a key 'categories' and an initial empty array
const categories = useState<Category[]>('categories', () => [])

// Fetch categories
const { data: categoriesData, error: categoriesError, refresh: refreshCategories } = useFetch<any[]>('/api/tool/categories', {
  key: 'categories',
  transform: (response) => {
    return response.map((category: any) => ({ ...category, active: false }))
  },
  onResponse: ({ response }) => {
    if (response.ok) {
      categories.value = response._data // Assign the transformed data to the categories state
    }
  },
  // Handle request errors
  onRequestError: ({ error }) => {
    console.error('Error fetching categories:', error)
  }
})

// Function to handle the toggling of a category's active state
const handleCategoryToggle = (category: Category) => {
  console.log(`Category toggled: ${category.name}`)
}

// Fetch categories when the component mounts
onMounted(() => {
  refreshCategories()
})

const searchQuery = ref('')
const nuxtApp = useNuxtApp()
const cacheKey = 'explore-data'

// Fetching explore data
const { data, error, refresh } = useFetch<ItemBasicInfo[]>(() => {
  const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : ''
  return `/api/data?explore=true${searchParam}`
}, {
  key: cacheKey,
  getCachedData: (key) => {
    try {
      if (nuxtApp.isHydrating && nuxtApp.payload?.data?.[key]) {
        return nuxtApp.payload.data[key]
      }
      if (nuxtApp.static?.data?.[key]) {
        return nuxtApp.static.data[key]
      }
    } catch (err) {
      console.error(`Error retrieving cached data for key ${key}:`, err)
    }
    return null
  },
  transform: (response) => {
    try {
      if (nuxtApp.static?.data) {
        nuxtApp.static.data[cacheKey] = response
      }
    } catch (err) {
      console.error(`Error caching data for key ${cacheKey}:`, err)
    }
    return response
  }
})

// Watch for errors
watch(error, (err) => {
  if (err) {
    console.error('An error occurred:', err)
    alert('Failed to fetch explore data. Please try again later.')
  }
})

watch(categoriesError, (err) => {
  if (err) {
    console.error('An error occurred while fetching categories:', err)
    alert('Failed to fetch categories. Please try again later.')
  }
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

  min-width: 26rem;
  max-width: 26rem;

  gap: $m;

  .aside__filters {
    display: flex;

    gap: $m;

    .filter {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      width: 50%;

      gap: $s;
      padding: $xl;

      border: 1px solid $primary-200;
      border-radius: $m;

      .filter__wrapper {
        display: flex;
        flex-direction: column;

        gap: $xs;

        &:not(:last-child) {
          margin-bottom: $s;
        }
      }
    }
  }
}

.section {
  flex-grow: 1;

  .tools__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    gap: $m;
  }
}
</style>
