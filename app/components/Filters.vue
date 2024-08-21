<template>
  <div v-if="type === 'reviews'" class="search-tools"
    :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class="filters">
      <li class="rating">
        <Tags variant="rating" @tag-toggled="handleTagToggle" />
      </li>
    </div>
    <button class="sort" @click="openDropdown(0)">
      <p class="p2">Most Relevant</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
    <Dropdown :open="isDropdownOpen" :id="0" @close="closeDropdown">
      <p class="dropdown--item">Most Relevant</p>
      <p class="dropdown--item">Most Recent</p>
      <p class="dropdown--item">Most Helpful</p>
    </Dropdown>
  </div>
  <div v-else-if="type === 'alternatives'" class="search-tools"
    :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class="filters">
      <li class="pricing">
        <Tags variant="pricing" @tag-toggled="handleTagToggle" />
      </li>
      <li class="licensing">
        <Tags variant="licensing" @tag-toggled="handleTagToggle" />
      </li>
      <li class="rating">
        <Tags variant="rating" @tag-toggled="handleTagToggle" />
      </li>
    </div>
    <button class="sort" @click="openDropdown(1)">
      <p class="p2">Most Popular</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
    <Dropdown :open="isDropdownOpen" :id="1" @close="closeDropdown">
      <p class="dropdown--item">Most Popular</p>
      <p class="dropdown--item">Most Recent</p>
      <p class="dropdown--item">Most Helpful</p>
    </Dropdown>
  </div>
  <div v-else-if="type === 'resources'" class="search-tools"
    :style="`z-index: ${searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class="filters">
      <li class="sources">
        <Tags variant="resource-src" @tag-toggled="handleTagToggle" />
      </li>
      <li class="types">
        <Tags variant="resource-types" @tag-toggled="handleTagToggle" />
      </li>
    </div>
    <button class="sort" @click="openDropdown(2)">
      <p class="p2">Most Relevant</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
    <Dropdown :open="isDropdownOpen" :id="2" @close="closeDropdown">
      <p class="dropdown--item">Most Relevant</p>
      <p class="dropdown--item">Most Recent</p>
      <p class="dropdown--item">Most Helpful</p>
    </Dropdown>
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

const { isDropdownOpen, openDropdown, closeDropdown } = useDropdown([0, 1, 2])

/* Temporary placeholder */
const handleTagToggle = (tag: Tag) => {
  console.log(tag)
}

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

    gap: $l;

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
    left: -1rem;
    height: $xxl * 2 + $m;
    width: calc(100% + 2rem);
    background-color: $system-bg;
    z-index: -1;
  }
}
</style>