<template>
  <span class="main">
    <span class="star-fill" :style="{ width: calculateRating(rating) }">
      <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
    </span>
    <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  rating: number
}>()
</script>

<style scoped lang="scss">
.main {
  position: relative;
  display: inline-flex;

  width: 8rem;

  user-select: none;

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
</style>