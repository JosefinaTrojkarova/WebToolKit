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
              <Stars :rating="headerData.rating.stars" />
              <p class="p2"><span class="b2">{{ headerData.rating.reviews }}</span> reviews</p>
              <p class="p2"><span class="b2">{{ headerData.rating.saves }}</span> saves</p>
            </div>
          </div>
        </div>
        <div class="buttons">
          <NuxtLink class="btn--primary--large web-btn" :to="headerData.website" target="_blank">Visit Website <span
              class="material-symbols-rounded">captive_portal</span></NuxtLink>
          <!-- <button class="btn--secondary--large--icon dropdown-btn" @click="openDropdown(0)">Contribute <span
              class="material-symbols-rounded">keyboard_arrow_down</span>
            <Dropdown :open="isDropdownOpen" :id="0" @close="closeDropdown" class="dropdown">
              <button class="dropdown--item">
                <p>Edit page</p>
                <span class="material-symbols-rounded">edit</span>
              </button>
              <button class="dropdown--item">
                <p>Add a tool</p>
                <span class="material-symbols-rounded">add</span>
              </button>
              <button class="dropdown--item">
                <p>Report page</p>
                <span class="material-symbols-rounded">warning</span>
              </button>
            </Dropdown>
          </button> -->
          <button class="save" @click="toggleActive" :class="{ active: isActive }" title="Save to list">
            <span class="material-symbols-rounded">bookmark</span>
          </button>
        </div>
      </main>
      <nav>
        <NuxtLink v-for="link in links" class="link p1" :class="{ 'router-link-active': isPathActive(link.path) }"
          :to="link.path">{{ link.name }}</NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { headerData, fetchHeaderData } = useFetchHeaderData()
// const { isDropdownOpen, openDropdown, closeDropdown } = useDropdown([0])

const links = [
  { name: 'Overview', path: `/tool/${(route.params.name as string).toLowerCase().replace(/\s+/g, '-')}` },
  { name: 'Reviews', path: `/tool/${(route.params.name as string).toLowerCase().replace(/\s+/g, '-')}/reviews` },
  { name: 'Alternatives', path: `/tool/${(route.params.name as string).toLowerCase().replace(/\s+/g, '-')}/alternatives` },
  // { name: 'Resources', path: `/tool/${(route.params.name as string).toLowerCase().replace(/\s+/g, '-')}/resources` },
]

const isPathActive = (path: string) => {
  return route.path === path
}

// Fetch header data when the layout is created
onMounted(async () => {
  if (route.params.name) {
    await fetchHeaderData()
  }
})

// Re-fetch when the route changes
watch(() => route.params.name, (newName) => {
  if (newName) {
    fetchHeaderData()
  }
})

const isActive = ref<boolean>(false)
const toggleActive = () => {
  isActive.value = !isActive.value;
}
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

      .web-btn {
        position: relative;

        transition: padding-right 0.2s ease-out;

        span {
          position: absolute;
          right: $xxl;

          color: transparent;
          font-variation-settings: 'opsz' 32, 'wght' 300, 'FILL' 0, 'GRAD' 100;

          transform: scale(0) rotateY(180deg);
          transition: color 0.2s ease-out, transform 0.2s ease-out;
        }

        &:hover {
          padding-right: 4rem;

          span {
            transform: scale(1) rotateY(180deg);
            color: $system-white;
          }
        }
      }

      .save {
        height: 3.5rem;

        padding: 0 $l;
        cursor: pointer;

        span {
          color: $primary-400;
          font-size: 2rem;
          font-variation-settings: 'opsz' 32, 'wght' 400, 'FILL' 0, 'GRAD' 100;

          transform-origin: top center;
          transition: font-variation-settings 0.1s ease-out, transform 0.1s ease-out;
          animation: shrink-bounce 0.2s ease-out;
        }
      }

      .active {
        span {
          font-variation-settings: 'opsz' 32, 'wght' 400, 'FILL' 1, 'GRAD' 100;

          transform-origin: top center;
          animation: expand-bounce 0.2s ease-out 0.1s;
        }
      }

      @keyframes expand-bounce {
        0% {
          transform: scale(1, 1);
        }

        50% {
          transform: scale(1, 1.2);
        }

        100% {
          transform: scale(1, 1);
        }
      }

      @keyframes shrink-bounce {
        0% {
          transform: scale(1, 1);
        }

        50% {
          transform: scale(1, 0.8);
        }

        100% {
          transform: scale(1, 1);
        }
      }

      .dropdown-btn {
        &:hover {
          span {
            animation: dropAndWiggle 0.5s ease;
          }
        }

        .dropdown {
          box-sizing: border-box;
          top: 3.7rem;
          right: 0;

          width: 100%;

          button {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            width: 100%;

            span {
              color: $primary-400;
              font-size: 1.5rem;
              font-variation-settings: 'opsz' 32, 'wght' 400, 'FILL' 0, 'GRAD' 100;
              animation: none;
            }
          }
        }
      }

      @keyframes dropAndWiggle {
        0% {
          transform: translateY(0) rotate(0deg);
        }

        25% {
          transform: translateY(2px) rotate(-5deg);
        }

        50% {
          transform: translateY(4px) rotate(5deg);
        }

        75% {
          transform: translateY(2px) rotate(-5deg);
        }

        100% {
          transform: translateY(0) rotate(0deg);
        }
      }
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