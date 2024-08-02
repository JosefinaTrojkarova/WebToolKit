<template>
  <div>
    <embed type="" :src="link" />
    <p>{{ type }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  link: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
})
</script>

<style scoped lang="scss">
embed {
  width: 10rem;
  height: 10rem;
}
</style>