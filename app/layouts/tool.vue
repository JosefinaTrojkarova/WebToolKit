<template>
  <div>
    <header v-if="headerData">
      <main>
        <div class="content">
          <img :src="headerData.logo" alt="" class="logo">
          <div class="info">
            <h2>{{ headerData.name }}</h2>
            <p>{{ headerData.shortDescription }}</p>
            <div class="rating">
              <span class="star-container">
                <span class="star-fill" :style="{ width: useCalculateRating(headerData.rating.stars) }">
                  <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
                </span>
                <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
              </span>
              <p class="p2"><span class="b2">{{ headerData.rating.reviews }}</span> reviews</p>
              <p class="p2"><span class="b2">{{ headerData.rating.saves }}</span> saves</p>
            </div>
          </div>
        </div>
        <div class="buttons">
          <NuxtLink class="btn--primary--large" :to="headerData.website" target="_blank">Visit Website</NuxtLink>
          <button class="btn--secondary--large--icon"><span class="material-symbols-rounded">keyboard_arrow_down</span>
            Contribute</button>
          <button class="btn--tertiary--large--icon"><span class="material-symbols-rounded">bookmark</span> Save to
            list</button>
        </div>
      </main>
      <nav>
        <NuxtLink v-for="link in links" class="link p1" :class="{ 'router-link-active': isActive(link.path) }"
          :to="link.path">{{ link.name }}</NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { headerData, fetchHeaderData } = useFetchHeaderData()

const links = [
  { name: 'Overview', path: `/tool/${route.params.name}` },
  { name: 'Reviews', path: `/tool/${route.params.name}/reviews` },
  { name: 'Alternatives', path: `/tool/${route.params.name}/alternatives` },
  { name: 'Resources', path: `/tool/${route.params.name}/resources` },
]

const isActive = (path: string) => {
  return route.path === path
}

// Fetch header data when the layout is created
onMounted(() => {
  if (route.params.name) {
    fetchHeaderData()
  }
})

// Re-fetch when the route changes
watch(() => route.params.name, (newName) => {
  if (newName) {
    fetchHeaderData()
  }
})
</script>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  width: 100%;

  padding: $xxl;
  gap: $l;

  main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    .content {
      display: flex;
      flex-direction: row;
      align-items: center;

      gap: $xxl;

      .logo {
        box-sizing: border-box;

        width: 9.375rem;
        height: 9.375rem;

        padding: 1rem;

        background-color: $system-white;

        border: 1px solid $primary-200;
        border-radius: $xl;
      }

      .info {
        display: flex;
        flex-direction: column;

        gap: $m;

        p {
          line-height: 100%;
        }

        .rating {
          display: flex;
          flex-direction: row;
          align-items: center;

          gap: $m;

          user-select: none;

          .star-container {
            position: relative;
            display: inline-flex;

            width: 8rem;

            .star-fill {
              display: flex;
              position: absolute;
              top: 0;
              left: 0;

              height: 100%;

              overflow: hidden;
              white-space: nowrap;

              .star {
                color: $secondary-400;
              }
            }

            .star {
              display: flex;
              justify-content: center;
              align-items: center;

              width: 1.6rem;

              color: $primary-100;

              font-variation-settings:
                'opsz' 40,
                'wght' 400,
                'FILL' 1,
                'GRAD' 100;
              font-size: 2rem;
            }
          }

          /* Align text to the perfect vertical center */
          .p2 {
            transform: translateY(0.1rem);
          }
        }
      }
    }

    .buttons {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;

      gap: $m;
    }
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    border-bottom: 1px solid $primary-200;

    .link {
      padding: $m $l;
      color: $primary-200;
      transform: translateY(-0.0625rem);
    }

    .router-link-active {
      color: $primary-400;
      border-bottom: 2px solid $secondary-400;
      transform: translateY(0.0625rem);
    }
  }
}
</style>