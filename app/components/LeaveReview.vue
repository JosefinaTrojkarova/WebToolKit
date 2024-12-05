<template>
  <div class="review">
    <NuxtLink class="review__logo" to="/">
      <span class="material-symbols-rounded">category_search</span>
    </NuxtLink>
    <main class="review__main">
      <h2 class="review__title">What do you think of {{ toolName }}?</h2>
      <form class="review__form">
        <label for="reviewStars" class="review__stars-label">
          How would you rate {{ toolName }}?
        </label>
        <div class="review__stars" id="reviewStars">
          <input type="radio" name="rating" value="1">
          <input type="radio" name="rating" value="2">
          <input type="radio" name="rating" value="3">
          <input type="radio" name="rating" value="4">
          <input type="radio" name="rating" value="5">
        </div>
        <label for="reviewText" class="review__textarea-label">
          Do you have something to say about {{ toolName }}?
        </label>
        <textarea class="review__textarea" id="reviewText"></textarea>
        <div class="review__checkbox-container">
          <input type="checkbox" id="useCheckbox" class="review__checkbox">
          <label for="useCheckbox" class="review__checkbox-label">
            I use {{ toolName }}?
          </label>
        </div>
        <button class="review__submit">Submit</button>
      </form>
    </main>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  toolName: string;
}

defineProps<Props>();
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
</style>