<template>
  <div v-if="type === 'reviews'" class="search-tools"
    :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class="filters">
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
      <p>Most Relevant</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
  </div>
  <div v-else-if="type === 'alternatives'" class="search-tools"
    :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class="filters">
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
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['reviews', 'alternatives', 'resources'].includes(value)
  },
  // Scroll transition trigger point
  trigger: {
    type: Number,
    required: true
  }
})

const searchToolsStyle = ref(0)

const checkScroll = () => {
  searchToolsStyle.value = window.scrollY > props.trigger ? 1 : 0
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped lang="scss">
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
</style>