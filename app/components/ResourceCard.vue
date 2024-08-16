<template>
  <div v-if="loading" class="loading"></div>
  <div v-else-if="error" class="resource" id="error">
    <main>
      <div class="error-image">
        <span class="material-symbols-rounded">warning</span>
      </div>
      <div class="content">
        <h3 class="title">Failed to load resource</h3>
        <p class="description p2">This is an issue on our side, try to reload the page. Sorry.</p>
        <p class="source">webtoolkit.com</p>
      </div>
    </main>
  </div>
  <NuxtLink v-else :to="link" target="_blank" class="resource" v-if="preview">
    <main>
      <img v-if="preview.image" :src="preview.image" :alt="preview.title" class="image">
      <div class="content">
        <h3 class="title">{{ preview.title }}</h3>
        <p class="description p2">{{ preview.description }}</p>
        <div class="origin">
          <p class="source">{{ preview.source }}</p>
          <p>•</p>
          <p>{{ preview.date }}</p>
        </div>
      </div>
    </main>
    <div v-if="type === 'article'" class="type">
      <span class="material-symbols-rounded">newsmode</span>
      <p class="b2">Article</p>
    </div>
    <div v-else-if="type === 'discussion'" class="type">
      <span class="material-symbols-rounded">forum</span>
      <p class="b2">Discussion</p>
      <p v-if="preview.replyCount">•</p>
      <p v-if="preview.replyCount" class="b2">{{ preview.replyCount }} replies</p>
    </div>
    <div v-else-if="type === 'video'" class="type">
      <span class="material-symbols-rounded">smart_display</span>
      <p class="b2">Video</p>
      <p v-if="preview.length">•</p>
      <span v-if="preview.length" class="material-symbols-rounded">schedule</span>
      <p v-if="preview.length" class="b2">{{ preview.length }}</p>
    </div>
  </NuxtLink>
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
.loading {
  min-width: 22rem;
  max-height: 30rem;

  background-color: $gray-100;
  border-radius: $m;
}

.resource {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  min-width: 22rem;
  height: 100%;

  border: 1px solid $primary-200;
  border-radius: $m;

  overflow: hidden;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;


    .image {
      width: 100%;
      object-fit: cover;

      border-bottom: 1px solid $primary-200;
    }

    .error-image {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 10rem;

      background-color: $primary-100;

      border-bottom: 1px solid $primary-200;

      .material-symbols-rounded {
        font-size: 3rem;
        color: $primary-400;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      padding: $xl;
      flex-grow: 1;
      overflow: hidden;

      .title {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }

      .description {
        color: $primary-400;
        margin-bottom: 0.5rem;
        box-sizing: border-box;
        overflow: hidden;
      }

      .origin {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $s;
      }

      .source,
      .video-length,
      .reply-count {
        font-size: 0.8rem;
        color: $gray-50;
      }
    }
  }

  .type {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: $s;
    padding: 0 $xl $xl $xl;

    .material-symbols-rounded {
      font-size: 1.5rem;
      color: $primary-400;
    }
  }

  &:hover {
    box-shadow: $shadow-300;
    transform: translateY(-0.3rem);
  }
}

#error {
  transition: none;

  &:hover {
    box-shadow: none;
    transform: none;
  }
}
</style>