<template>
  <NuxtLayout name="tool">
    <!-- Error state -->
    <div v-if="alternativesError">
      <p>Error: {{ alternativesError.message }}</p>
      <button @click="retryFetch">Retry</button>
    </div>
    <!-- Working state -->
    <main v-else-if="isMounted && alternativesData">
      <div class="main-tool">
        <ToolCard v-if="mainTool" :data="mainTool" :main="true" />
      </div>
      <div class="alternatives-wrapper">
        <div class="search-tools" :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
          <div class="filters">
            <li class="all">
              <button>All</button>
            </li>
            <li class="pricing">
              <button class="tag--static--pricing">
                <span class="material-symbols-rounded">attach_money</span>
                <p>100% Free</p>
              </button>
              <button class="tag--static--pricing">
                <span class="material-symbols-rounded">attach_money</span>
                <p>Free Version</p>
              </button>
              <button class="tag--static--pricing">
                <span class="material-symbols-rounded">attach_money</span>
                <p>Free Trial</p>
              </button>
              <button class="tag--static--pricing">
                <span class="material-symbols-rounded">attach_money</span>
                <p>Paid</p>
              </button>
            </li>
            <li class="licensing">
              <button class="tag--static--licensing">
                <span class="material-symbols-rounded">license</span>
                <p>Open Source</p>
              </button>
              <button class="tag--static--licensing">
                <span class="material-symbols-rounded">license</span>
                <p>Proprietary</p>
              </button>
            </li>
            <li class="rating">
              <button class="tag--static--rating">
                <span class="material-symbols-rounded">star</span>
                <p>5</p>
              </button>
              <button class="tag--static--rating">
                <span class="material-symbols-rounded">star</span>
                <p>4</p>
              </button>
              <button class="tag--static--rating">
                <span class="material-symbols-rounded">star</span>
                <p>3</p>
              </button>
              <button class="tag--static--rating">
                <span class="material-symbols-rounded">star</span>
                <p>2</p>
              </button>
              <button class="tag--static--rating">
                <span class="material-symbols-rounded">star</span>
                <p>1</p>
              </button>
            </li>
          </div>
          <button class="sort">
            <p>Most Popular</p>
            <span class="material-symbols-rounded">sort</span>
          </button>
        </div>
        <div class="alternatives">
          <ToolCard v-for="alt in alternatives" :key="alt._id" :data="alt" />
        </div>
      </div>
    </main>
    <!-- Loading state -->
    <div v-else class="loading">
      <h4>One moment please...</h4>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
// Hydration mismatch prevention
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
onUnmounted(() => {
  isMounted.value = false
})

const route = useRoute()
const { name } = route.params

const { data: alternativesData, error: alternativesError, refresh: refreshAlternatives } = useFetch(`/api/tool/${name}`, {
  params: { alternativesOnly: 'true' },
})
const { alternatives, mainTool, retryFetch: retryAlternatives } = useFetchAlternatives(alternativesData)


const retryFetch = () => {
  refreshAlternatives()
  retryAlternatives()
}

const searchToolsStyle = ref(0)

const checkScroll = () => {
  searchToolsStyle.value = window.scrollY > 350 ? 1 : 0
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;

  width: 100%;

  padding: 0 $xxl;
  gap: $xxl;

  .main-tool {
    position: sticky;
    top: $xxl + $xxl + $m;
    flex: 1;
    height: min-content;
    margin-top: $xxl + $m;
  }

  .alternatives-wrapper {
    flex: 3;
    display: flex;
    flex-direction: column;

    .search-tools {
      position: sticky;
      top: $xxl;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      width: 100%;

      padding: 0 0 $m 0;

      background-color: $system-bg;

      border-bottom: 1px solid $primary-200;

      transition: border-bottom-width 0.1s ease;

      .filters {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: $m;

        .all {
          button {
            height: $xxl;
            padding: 0 $m;
            border-radius: $s;
            background-color: $primary-400;
            color: $system-white;
            font-weight: 500;
            cursor: pointer;
          }
        }

        li {
          display: flex;
          flex-direction: row;
          align-items: center;

          gap: $s;
        }
      }

      .sort {
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;

        height: $xxl;

        gap: $s;
        padding: 0 $m;

        cursor: pointer;

        span {
          color: $primary-400;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: -$xxl;
        left: -2%;
        height: $xxl * 2 + $m;
        width: 104%;
        background-color: $system-bg;
        z-index: -1;
      }
    }

    .alternatives {
      display: grid;
      grid-template-columns: repeat(3, minmax(300px, 1fr));
      gap: $m;
    }
  }
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 80vh;
  width: 100%;
}
</style>