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
            placeholder="Search for tools" />
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
                <Tags variant="pricing" @tag-toggled="handleTagToggle" />
              </ul>
            </div>
            <div class="filter__wrapper">
              <p>Licensing</p>
              <ul class="filter__list">
                <Tags variant="licensing" @tag-toggled="handleTagToggle" />
              </ul>
            </div>
            <div class="filter__wrapper">
              <p>Rating</p>
              <ul class="filter__list">
                <Tags variant="rating" @tag-toggled="handleTagToggle" />
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <section class="section tools">
        <!-- Error -->
        <div class="error" v-if="error">
          <p class="error__message">Error: {{ error.message }}</p>
        </div>
        <!-- Data loaded -->
        <div class="tools__list" v-else-if="filteredTools">
          <ToolCardExplore v-for="item in filteredTools" :key="item._id" :item="item" />
          <p v-if="filteredTools.length === 0">No tools found.</p>
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
  filteredTools
} = useExplore()

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
