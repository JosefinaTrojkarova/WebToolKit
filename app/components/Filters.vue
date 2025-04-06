<template>
  <div v-if="type === 'reviews'" class="search-tools"
    :style="`z-index: ${40 + searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
    <div class=" filters">
      <li class="rating">
        <Tags variant="rating" @tag-toggled="handleTagToggle" />
      </li>
    </div>
    <button class="sort" @click="openDropdown(0)">
      <p class="p2">{{ currentSort }}</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
    <Dropdown :open="isDropdownOpen" :id="0" @close="closeDropdown">
      <p class="dropdown--item" @click="handleSortChange('Most Recent')">Most Recent</p>
      <p class="dropdown--item" @click="handleSortChange('Oldest')">Oldest</p>
    </Dropdown>
  </div>
  <div v-else-if="type === 'alternatives'" class="search-tools"
    :style="`z-index: ${40 + searchToolsStyle}; border-bottom-width: ${searchToolsStyle};`">
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
      <p class="p2">{{ currentSort }}</p>
      <span class="material-symbols-rounded">sort</span>
    </button>
    <Dropdown :open="isDropdownOpen" :id="1" @close="closeDropdown">
      <p class="dropdown--item" @click="handleSortChange('Highest Rated')">Highest Rated</p>
      <p class="dropdown--item" @click="handleSortChange('Lowest Rated')">Lowest Rated</p>
      <p class="dropdown--item" @click="handleSortChange('A to Z')">A to Z</p>
      <p class="dropdown--item" @click="handleSortChange('Z to A')">Z to A</p>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['reviews', 'alternatives'].includes(value)
  },
  trigger: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['sort-changed', 'filter-toggled'])
const { isDropdownOpen, openDropdown, closeDropdown } = useDropdown([0, 1])

// Default sort based on type
const getDefaultSort = (type: string) => {
  switch (type) {
    case 'reviews':
      return 'Most Recent'
    case 'alternatives':
      return 'Highest Rated'
    default:
      return 'Most Recent'
  }
}

const currentSort = ref(getDefaultSort(props.type))

watch(() => props.type, (newType) => {
  currentSort.value = getDefaultSort(newType)
})

const handleSortChange = (sortOption: string) => {
  currentSort.value = sortOption
  emit('sort-changed', sortOption)
  closeDropdown(props.type === 'reviews' ? 0 : 1)
}

const handleTagToggle = (filter: Tag) => {
  emit('filter-toggled', { type: filter.variant, value: filter.tag.name })
}

// Scroll handling
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
  flex-wrap: wrap;

  width: 100%;

  margin: 0 0 $xl 0;

  background-color: $system-bg;

  border-bottom: 1px solid $primary-200;

  transition: border-bottom-width 0.1s ease;

  .filters {
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: $l;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;

      gap: $s;
    }
  }

  .sort {
    flex-wrap: wrap;
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