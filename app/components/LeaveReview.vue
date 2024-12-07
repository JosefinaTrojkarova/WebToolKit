<template>
  <div class="review">
    <NuxtLink class="review__logo" to="/">
      <span class="material-symbols-rounded">category_search</span>
    </NuxtLink>
    <main class="review__main">
      <h2 class="review__title">What do you think of {{ toolName }}?</h2>
      <form class="review__form" @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">{{ error }}</div>

        <label for="reviewStars" class="review__stars-label">
          How would you rate {{ toolName }}?
        </label>
        <div class="review__stars" id="reviewStars">
          <input v-for="n in 5" :key="n" type="radio" name="rating" :value="n" v-model="formData.rating">
        </div>

        <label for="reviewText" class="review__textarea-label">
          Do you have something to say about {{ toolName }}?
        </label>
        <textarea class="review__textarea" id="reviewText" v-model="formData.comment" required></textarea>

        <button class="review__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </main>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  toolName: string;
  toolId: string;
}

const { postReview, error } = useReviewTool();
const { data } = useAuth()

const props = defineProps<Props>();
const emit = defineEmits(['reviewSubmitted']);

const user: string = data.value?.user?.email || '';

const isSubmitting = ref(false);
const formData = reactive({
  rating: null as number | null,
  comment: ''
});

const handleSubmit = async () => {
  if (!formData.rating || !formData.comment || !user) {
    return;
  }

  isSubmitting.value = true;

  try {
    await postReview(
      props.toolId,
      user,
      formData.comment,
      formData.rating
    );
    emit('reviewSubmitted');
    formData.comment = '';
    formData.rating = null;
  } catch (err) {
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.review {
  display: flex;
  flex-direction: column;

  gap: $m;
  width: 48.75rem;
  height: 28.125rem;

  background-color: $system-bg;

  &__logo {
    display: flex;
    align-items: center;
    gap: $m;
    height: $xxl;

    span {
      color: $primary-400;
      font-size: 2rem;
      font-variation-settings: 'opsz' 32, 'wght' 500, 'FILL' 0, 'GRAD' 100;
    }
  }
}

.review__main {
  display: flex;
  justify-content: center;

  width: 100%;
  height: 100%;

  gap: $m;

  .review__title {
    width: 50%;
  }

  form {
    display: flex;
    flex-direction: column;

    gap: $m;
    width: 50%;

    .review__checkbox-container {
      display: flex;
      align-items: center;
      gap: $xs;
      margin: $s 0;
    }

    .review__submit {
      cursor: pointer;
      width: 30%;
      padding: $l;
      background-color: $primary-400;
      color: white;

      &:hover {
        background-color: $primary-200;
      }
    }
  }
}

.error-message {
  color: red;
  margin-bottom: $m;
}

.review__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>