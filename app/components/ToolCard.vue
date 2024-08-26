<template>
  <div v-if="alt === 'homepage'" class="explore" id="homepage-card">
    <div class="heading">
      <img class="logo" :src="data.logo" :alt="data.name">
      <div class="content-wrapper">
        <h3>{{ data.name }}</h3>
        <div class="tags">
          <div class="tag tag--pricing">
            <span class="icon material-symbols-rounded">attach_money</span>
            <p class="text p2">{{ data.tags.pricing }}</p>
          </div>
          <div class="tag tag--licensing">
            <span class="icon material-symbols-rounded">license</span>
            <p class="text p2">{{ data.tags.licensing }}</p>
          </div>
        </div>
        <div class="rating">
          <Stars :rating="data.rating.stars" />
          <p class="p2"><span class="b2">{{ data.rating.reviews }}</span> reviews</p>
          <p class="p2"><span class="b2">{{ data.rating.saves }}</span> saves</p>
        </div>
      </div>
      <label class="select" @click.stop>
        <input class="checkbox-default" type="checkbox">
        <span class="checkbox">
          <span class="material-symbols-rounded check-icon">check</span>
        </span>
      </label>
    </div>
    <div class="main">
      <p class="item-description">{{ data.description }}</p>
    </div>
    <div class="categories">
      <span v-for="category in data.categories" :key="category" class="static-category">
        <p>{{ category }}</p>
      </span>
    </div>
  </div>

  <div v-else-if="alt === 'main'" class="alternative" id="main">
    <label class="select" @click.stop>
      <input class="checkbox-default" type="checkbox">
      <span class="checkbox">
        <span class="material-symbols-rounded check-icon">check</span>
      </span>
    </label>
    <img class="logo" :src="data.logo || ''" :alt="data.name" />
    <div class="info">
      <h3>{{ data.name }}</h3>
      <p>{{ data.shortDescription }}</p>
    </div>
    <div class="categories">
      <span v-for="category in data.categories" :key="category" class="static-category">
        <p>{{ category }}</p>
      </span>
    </div>
    <hr>
    <div class="pricing">
      <p class="b1">Pricing:</p>
      <div class="tag--static--pricing">
        <span class="material-symbols-rounded">attach_money</span>
        <p>{{ data.tags?.pricing || 'Not available' }}</p>
      </div>
    </div>
    <div class="licensing">
      <p class="b1">Licensing:</p>
      <div class="tag--static--licensing">
        <span class="material-symbols-rounded">license</span>
        <p>{{ data.tags?.licensing || 'Not available' }}</p>
      </div>
    </div>
    <hr>
    <div class="rating">
      <Stars :rating="data.rating.stars" />
      <p class="b2">{{ data.rating.stars.toFixed(1) }}/5</p>
      <p class="p2"><span class="b2">{{ data.rating.saves }}</span> saves</p>
    </div>
    <div class="pros">
      <p class="pros-header b1"><span class="material-symbols-rounded">thumb_up</span> Pros
      </p>
      <div v-for="(pro) in sortAndLimitItems(data.pros)" class="opinion-row">
        <p>{{ pro.name }}</p>
        <p class="b1">{{ pro.votes }}</p>
      </div>
    </div>
    <div class="cons">
      <p class="cons-header b1"><span class="material-symbols-rounded">thumb_down</span> Cons
      </p>
      <div v-for="(con) in sortAndLimitItems(data.cons)" class="opinion-row">
        <p>{{ con.name }}</p>
        <p class="b1">{{ con.votes }}</p>
      </div>
    </div>
  </div>

  <NuxtLink v-else :to="`/tool/${data.name.toLowerCase().replace(/\s+/g, '-')}`">
    <div v-if="data.pros !== undefined" class="alternative">
      <label class="select" @click.stop>
        <input class="checkbox-default" type="checkbox">
        <span class="checkbox">
          <span class="material-symbols-rounded check-icon">check</span>
        </span>
      </label>
      <img class="logo" :src="data.logo" :alt="data.name" />
      <div class="info">
        <h3>{{ data.name }}</h3>
        <p>{{ data.shortDescription }}</p>
      </div>
      <div class="categories">
        <span v-for="category in data.categories" :key="category" class="static-category">
          <p>{{ category }}</p>
        </span>
      </div>
      <hr>
      <div class="pricing">
        <p class="b1">Pricing:</p>
        <div class="tag--static--pricing">
          <span class="material-symbols-rounded">attach_money</span>
          <p>{{ data.tags?.pricing || 'Not available' }}</p>
        </div>
      </div>
      <div class="licensing">
        <p class="b1">Licensing:</p>
        <div class="tag--static--licensing">
          <span class="material-symbols-rounded">license</span>
          <p>{{ data.tags?.licensing || 'Not available' }}</p>
        </div>
      </div>
      <hr>
      <div class="rating">
        <Stars :rating="data.rating.stars" />
        <p class="b2">{{ data.rating.stars.toFixed(1) }}/5</p>
        <p class="p2"><span class="b2">{{ data.rating.saves }}</span> saves</p>
      </div>
      <div class="pros">
        <p class="pros-header b1"><span class="material-symbols-rounded">thumb_up</span> Pros
        </p>
        <div v-for="(pro) in sortAndLimitItems(data.pros)" class="opinion-row">
          <p>{{ pro.name }}</p>
          <p class="b1">{{ pro.votes }}</p>
        </div>
      </div>
      <div class="cons">
        <p class="cons-header b1"><span class="material-symbols-rounded">thumb_down</span> Cons
        </p>
        <div v-for="(con) in sortAndLimitItems(data.cons)" class="opinion-row">
          <p>{{ con.name }}</p>
          <p class="b1">{{ con.votes }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="data.rating !== undefined" class="explore">
      <div class="heading">
        <img class="logo" :src="data.logo" :alt="data.name">
        <div class="content-wrapper">
          <h3>{{ data.name }}</h3>
          <div class="tags">
            <div class="tag tag--pricing">
              <span class="icon material-symbols-rounded">attach_money</span>
              <p class="text p2">{{ data.tags.pricing }}</p>
            </div>
            <div class="tag tag--licensing">
              <span class="icon material-symbols-rounded">license</span>
              <p class="text p2">{{ data.tags.licensing }}</p>
            </div>
          </div>
          <div class="rating">
            <Stars :rating="data.rating.stars" />
            <p class="p2"><span class="b2">{{ data.rating.reviews }}</span> reviews</p>
            <p class="p2"><span class="b2">{{ data.rating.saves }}</span> saves</p>
          </div>
        </div>
        <label class="select" @click.stop>
          <input class="checkbox-default" type="checkbox">
          <span class="checkbox">
            <span class="material-symbols-rounded check-icon">check</span>
          </span>
        </label>
      </div>
      <div class="main">
        <p class="item-description">{{ data.description }}</p>
      </div>
      <div class="categories">
        <span v-for="category in data.categories" :key="category" class="static-category">
          <p>{{ category }}</p>
        </span>
      </div>
    </div>
    <div v-else class="mini"></div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: ItemBasicInfo | Alternative /* | Mini */
  alt?: 'main' | 'homepage'
}>()

type Opinion = {
  name: string
  votes: string
}

const sortAndLimitItems = (items: Opinion[]) => {
  return items
    .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
    .slice(0, 4);
}
</script>

<style scoped lang="scss">
#main {
  transition: none;

  &:hover {
    box-shadow: none;
    transform: none;
  }
}

.alternative {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  height: 100%;

  padding: $xl;
  gap: $m;

  border: 1px solid $primary-200;
  border-radius: $m;

  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  .select {
    position: absolute;
    display: block;
    overflow: hidden;

    top: $xl;
    right: $xl;

    height: $xl;
    width: 6.5rem;

    cursor: pointer;

    input[type="checkbox"] {
      display: none;
    }

    .checkbox {
      position: absolute;
      top: 0;
      right: 0;

      display: flex;
      justify-content: center;
      align-items: center;

      box-sizing: border-box;

      height: $xl;
      width: $xl;

      background-color: $primary-100;

      border: 0.0625rem solid $primary-200;
      border-radius: $xs;

      transition: border 0.1s ease-out;

      .check-icon {
        opacity: 0;
        visibility: hidden;

        color: $system-white;
        font-size: 0rem;

        transition: font-size 0.2s ease-out, opacity 0.2s ease-out, visibility 0.2s ease-out;
      }
    }

    &::before {
      content: "Compare";

      position: absolute;
      top: $xs;
      right: -2.7rem;

      color: $primary-400;

      transition: right 0.2s ease-out;
    }

    &:hover::before {
      right: 2rem;
      transition: right 0.3s ease-out;
    }

    input:checked~ {
      .checkbox .check-icon {
        opacity: 1;
        visibility: visible;

        font-size: 1.3rem;

        transition-delay: 0.1s;
      }
    }

    input:checked~.checkbox {
      border: 0.8rem solid $primary-400;

      transition: border 0.2s ease-out;
      animation: shrink-bounce 200ms cubic-bezier(.4, .0, .23, 1);
    }

    // Optional: Add hover and active states
    &:hover .checkbox {
      border: 0.0625rem solid $primary-300;
    }

    @keyframes shrink-bounce {
      0% {
        transform: scale(1);
      }

      33% {
        transform: scale(.9);
      }

      100% {
        transform: scale(1);
      }
    }
  }

  .logo {
    box-sizing: border-box;

    width: 6.25rem;
    height: 6.25rem;

    padding: $s;

    border: 1px solid $primary-200;
    border-radius: $xl;
  }

  .categories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;

    width: 100%;
    flex-grow: 1;

    gap: $s;
  }

  hr {
    width: 100%;
    border-top: 1px solid $primary-200;
    border-bottom: none;
    border-left: none;
    border-right: none;
  }

  .pricing,
  .licensing {
    display: flex;
    flex-direction: column;

    gap: $xs;
  }

  .rating {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: $m;
  }

  .pros,
  .cons {
    display: flex;
    flex-direction: column;

    gap: $xs;

    .pros-header,
    .cons-header {
      display: flex;
      align-items: center;

      gap: $xs;
      padding-bottom: $xs;
    }

    .opinion-row {
      display: flex;
      justify-content: space-between;

      gap: $s;
    }
  }

  &:hover {
    box-shadow: $shadow-300;
    transform: translateY(-0.3rem);
  }
}

#homepage-card {
  box-sizing: border-box;
  user-select: none;
  width: fit-content;
  height: fit-content;

  .heading {
    .logo {
      min-width: 7rem;
      min-height: 7rem;
    }

    .content-wrapper {
      display: none;
    }

    .select {
      display: none;
    }
  }

  .main {
    display: none;
  }

  .categories {
    display: none;
  }
}

.explore {
  position: relative;
  display: flex;
  flex-direction: column;

  flex-grow: 1;

  gap: $m;
  padding: $xl;

  text-decoration: none;

  border: 1px solid $primary-200;
  border-radius: $m;

  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  .heading {
    display: flex;
    gap: $m;

    .logo {
      box-sizing: border-box;

      width: 6.25rem;
      height: 6.25rem;

      padding: $s;

      border: 1px solid $primary-200;
      border-radius: $xl;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .tags {
        display: flex;

        gap: $l;

        .tag {
          display: flex;
          align-items: center;

          gap: $xs;

          &--pricing {
            color: $system-success;

            .text {
              color: inherit;
              font-weight: 600;
              height: 1.3rem;
            }

            .icon {
              font-size: 1.5rem;
            }
          }

          &--licensing {
            color: $primary-400;

            .text {
              color: inherit;
              font-weight: 600;
              height: 1.3rem;
            }

            .icon {
              font-size: 1.25rem;
            }
          }

          .icon {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 1rem;

            font-variation-settings:
              'opsz' 20,
              'wght' 400,
              'FILL' 0,
              'GRAD' 100;
          }
        }
      }

      .rating {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: $m;
      }
    }

    .select {
      position: absolute;
      display: block;
      overflow: hidden;

      top: $xl;
      right: $xl;

      height: $xl;
      width: 6.5rem;

      cursor: pointer;

      input[type="checkbox"] {
        display: none;
      }

      .checkbox {
        position: absolute;
        top: 0;
        right: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        box-sizing: border-box;

        height: $xl;
        width: $xl;

        background-color: $primary-100;

        border: 0.0625rem solid $primary-200;
        border-radius: $xs;

        transition: border 0.1s ease-out;

        .check-icon {
          opacity: 0;
          visibility: hidden;

          color: $system-white;
          font-size: 0rem;

          transition: font-size 0.2s ease-out, opacity 0.2s ease-out, visibility 0.2s ease-out;
        }
      }

      &::before {
        content: "Compare";

        position: absolute;
        top: $xs;
        right: -2.7rem;

        color: $primary-400;

        transition: right 0.2s ease-out;
      }

      &:hover::before {
        right: 2rem;
        transition: right 0.3s ease-out;
      }

      input:checked~ {
        .checkbox .check-icon {
          opacity: 1;
          visibility: visible;

          font-size: 1.3rem;

          transition-delay: 0.1s;
        }
      }

      input:checked~.checkbox {
        border: 0.8rem solid $primary-400;

        transition: border 0.2s ease-out;
        animation: shrink-bounce 200ms cubic-bezier(.4, .0, .23, 1);
      }

      // Optional: Add hover and active states
      &:hover .checkbox {
        border: 0.0625rem solid $primary-300;
      }

      @keyframes shrink-bounce {
        0% {
          transform: scale(1);
        }

        33% {
          transform: scale(.9);
        }

        100% {
          transform: scale(1);
        }
      }
    }
  }

  .main {
    .item-description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;

    gap: $s;
  }

  &:hover {
    box-shadow: $shadow-300;
    transform: translateY(-0.3rem);
  }
}
</style>