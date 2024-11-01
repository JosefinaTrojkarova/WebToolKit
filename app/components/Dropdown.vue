<template>
  <Transition name="dropdown-fade">
    <div v-if="open[id]?.state" ref="dropdownRef" class="dropdown">
      <slot></slot>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
interface DropdownItem {
  id: number;
  state: boolean;
}

const props = defineProps<{
  open: DropdownItem[];
  id: number
}>()

const emit = defineEmits<{
  (e: 'close', id: number): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null)

const closeDropdown = () => {
  emit('close', props.id)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

watch(
  () => props.open[props.id],
  (newValue) => {
    if (newValue?.state) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside)
      }, 50)
    } else {
      document.removeEventListener("click", handleClickOutside)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="scss">
.dropdown {
  position: absolute;
  top: 2.5rem;
  right: $s;

  background-color: $system-bg;

  border: 1px solid $primary-400;
  border-radius: $m;

  box-shadow: $shadow-300;

  overflow: hidden;
  opacity: 1;
  transform: translateX(0);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.3rem);
}
</style>