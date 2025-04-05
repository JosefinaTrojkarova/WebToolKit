<template>
  <div class="explore">
    <header class="header">
      <h2 class="header__title">Explore</h2>
    </header>
    <main class="explore__main">
      <aside class="aside">
        <div class="aside-wrapper">
          <label class="search-container" for="search-field">
            <span class="search-icon material-symbols-rounded">search</span>
            <input id="search-field" class="field--search aside__search" v-model="searchQuery" type="text"
              placeholder="Search for tools" />
          </label>
          <div class="aside__filters">
            <div class="filter filter--categories">
              <h4 class="filter__heading">Categories</h4>
              <div class="filter__list">
                <Categories :categories="categories" @category-toggled="handleCategoryToggle" />
              </div>
            </div>
            <div class="filter filter--tags">
              <h4 class="filter__heading">Tags</h4>
              <div class="filter__wrapper">
                <p>Pricing</p>
                <div class="filter__list">
                  <Tags variant="pricing" @tag-toggled="handleTagToggle" />
                </div>
              </div>
              <div class="filter__wrapper">
                <p>Licensing</p>
                <div class="filter__list">
                  <Tags variant="licensing" @tag-toggled="handleTagToggle" />
                </div>
              </div>
              <div class="filter__wrapper">
                <p>Rating</p>
                <div class="filter__list">
                  <Tags variant="rating" @tag-toggled="handleTagToggle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <section class="section tools">
        <!-- Loading state -->
        <div v-if="status" class="loading">
          <p>Loading tools and categories...</p>
        </div>
        <!-- Error state -->
        <div v-else-if="error" class="error">
          <p class="error__message">{{ error.message || 'Failed to load data' }}</p>
          <button @click="retryFetch" class="retry-button">Retry</button>
        </div>
        <!-- Data loaded -->
        <div v-else-if="data && data.length > 0" class="tools__list">
          <ToolCard v-for="item in filteredTools" :key="item._id" :data="item" />
          <!-- Show "No tools found" only when filtering results in empty list -->
          <p v-if="filteredTools.length === 0" class="no-results">
            No tools match your filters.
          </p>
        </div>
        <!-- No data available -->
        <div v-else class="no-data">
          <p>No tools available.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const {
  categories,
  searchQuery,
  refreshCategories,
  handleCategoryToggle,
  handleTagToggle,
  error,
  filteredTools,
  retryFetch,
  status,
  data
} = useExplore()

// Reset scroll position when filters change
watch(
  () => filteredTools,
  () => {
    if (window.scrollY > 200) {
      window.scrollTo({ top: 200 })
    }
  },
  { deep: true, immediate: false }
)

// Fetch categories on component mount
onMounted(() => {
  refreshCategories()
})
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

  @media (max-width: 1000px) {
    flex-direction: column;
  }
}

.aside {
  display: flex;
  flex-direction: column;

  min-width: 26rem;
  max-width: 26rem;

  gap: $m;

  @media (max-width: 1000px) {
    min-width: 100%;
    max-width: 100%;
  }

  .aside-wrapper {
    position: sticky;
    display: flex;
    flex-direction: column;

    top: $xxl;

    width: 100%;

    gap: $m;

    .aside__filters {
      display: flex;

      gap: $m;

      @media (max-width: 550px) {
        flex-direction: column;
      }

      .filter {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        width: 50%;

        gap: $s;
        padding: $xl;

        border: 1px solid $primary-200;
        border-radius: $m;

        @media (max-width: 550px) {
          width: 100%;
        }

        .filter__wrapper {
          display: flex;
          flex-direction: column;

          gap: $xs;

          .filter__list {
            display: flex;
            flex-direction: column;

            gap: $s;

            @media (max-width: 1000px) {
              flex-direction: row;
              flex-wrap: wrap;
            }
          }

          &:not(:last-child) {
            margin-bottom: $s;
          }
        }
      }
    }
  }
}

.section {
  flex-grow: 1;

  .loading,
  .error,
  .no-data {
    text-align: center;
    padding: $xl;
    color: $primary-600;
  }

  .error {
    .retry-button {
      margin-top: $m;
      padding: $s $m;
      border: 1px solid $primary-400;
      border-radius: $s;
      background: $primary-100;
      color: $primary-600;
      cursor: pointer;

      &:hover {
        background: $primary-200;
      }
    }
  }

  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    color: $primary-600;
  }

  .tools__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));

    gap: $m;
  }
}
</style>
