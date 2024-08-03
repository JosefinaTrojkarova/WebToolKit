<template>
  <NuxtLink :to="link" target="_blank" class="resource" v-if="preview">
    <img v-if="preview.image" :src="preview.image" :alt="preview.title" class="image">
    <div class="content">
      <h3 class="title">{{ preview.title }}</h3>
      <p class="description p2">{{ preview.description }}</p>
      <p class="source">Source: {{ preview.source }}</p>
      <p v-if="type === 'video'" class="video-length">Length: {{ preview.length }}</p>
      <p v-if="type === 'discussion'" class="reply-count">Replies: {{ preview.replyCount }}</p>
    </div>
  </NuxtLink>
  <div v-else-if="loading" class="loading">Loading preview...</div>
  <div v-else-if="error" class="error">Failed to load preview</div>
</template>

<script lang="ts" setup>
const props = defineProps({
  link: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['article', 'discussion', 'video'].includes(value)
  },
})

const { preview, loading, error } = useLinkPreview(props.link, props.type)
</script>

<style scoped lang="scss">
.resource {
  min-width: 22rem;

  border: 1px solid $primary-200;
  border-radius: $m;

  overflow: hidden;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  .image {
    width: 100%;
    height: auto;
    object-fit: cover;

    border-bottom: 1px solid $primary-200;
  }

  .content {
    padding: $xl;
  }

  .title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .description {
    color: $primary-400;
    margin-bottom: 0.5rem;
  }

  .source,
  .video-length,
  .reply-count {
    font-size: 0.8rem;
    color: $gray-50;
  }

  &:hover {
    box-shadow: $shadow-300;
    transform: translateY(-0.3rem);
  }
}

.loading,
.error {
  min-width: 22rem;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: $gray-50;
}
</style>