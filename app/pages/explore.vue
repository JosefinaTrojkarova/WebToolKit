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
              <Categories :categories="myCategories" @category-toggled="handleCategoryToggle" />
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

const searchQuery = ref('')

const nuxtApp = useNuxtApp()
const cacheKey = 'explore-data'

// Fetching data
const { data, error, refresh } = useFetch<ItemBasicInfo[]>(() => {
  // Construct the search parameter string
  const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : '';
  // Return the API endpoint URL
  return `/api/data?explore=true${searchParam}`;
}, {
  key: cacheKey,

  // Retrieve cached data
  getCachedData: (key) => {
    try {
      // Check if data is in Nuxt payload during SSR hydration
      if (nuxtApp.isHydrating && nuxtApp.payload?.data?.[key]) {
        return nuxtApp.payload.data[key];
      }
      // Check if data is in the static cache
      if (nuxtApp.static?.data?.[key]) {
        return nuxtApp.static.data[key];
      }
    } catch (err) {
      console.error(`Error retrieving cached data for key ${key}:`, err);
    }
    return null;
  },

  // Transform and cache the response
  transform: (response) => {
    try {
      // Store the fetched data in the static cache
      if (nuxtApp.static?.data) {
        nuxtApp.static.data[cacheKey] = response;
      }
    } catch (err) {
      console.error(`Error caching data for key ${cacheKey}:`, err);
    }
    return response;
  }
});

// Watch for errors
watch(error, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    alert('Failed to fetch explore data. Please try again later.');
  }
});

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
