<template>
  <NuxtLayout name="tool">
    <div v-if="error">
      <p>Error: {{ error.message }}</p>
      <button @click="retryFetch">Retry</button>
    </div>
    <div v-else-if="reviews && isMounted" class="reviews">
      <div class="review-cta">
        <p>Got something to say about {{ reviews.name }}? Leave a review!</p>
        <button class="btn--secondary--small">Leave a Review</button>
      </div>
      <ul class="review-wrapper">
        <li v-for="review in reviews" :key="review.date" class="review">
          <div class="review-content-wrapper">
            <div class="comment-header">
              <div class="user-info">
                <img :src="review.userProfilePic" alt="pfp" class="user-pfp">
                <div class="user-details">
                  <p class="b1">{{ review.username }}</p>
                  <p class="p3">{{ review.userContributions }} contributions</p>
                </div>
              </div>
              <span class="material-symbols-rounded report-btn">report</span>
            </div>
            <div class="star-rating">
              <span v-for="star in 5" :key="star" class="material-symbols-rounded"
                :class="{ 'filled': star <= review.rating, 'empty': star > review.rating }">
                star_rate
              </span>
            </div>
            <p>{{ review.comment }}</p>
          </div>
          <p class="date p3">{{ formatDate(review.date) }}</p>
        </li>
      </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Hydration mismatch prevention
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
onUnmounted(() => {
  isMounted.value = false
})

const { reviews, error, retryFetch: retryReviews } = useFetchReviews()

const retryFetch = () => {
  retryReviews()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped lang="scss">
.reviews {
  display: flex;
  flex-direction: column;

  flex-grow: 1;

  gap: $m;

  .review-cta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    width: 100%;

    padding: $xl;

    border: 1px solid $primary-200;
    border-radius: $m;
  }

  .review-wrapper {
    display: flex;
    flex-direction: row;

    width: 100%;
    flex-grow: 1;

    gap: $m;

    .review {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      flex-grow: 1;

      padding: $xl;

      border: 1px solid $primary-200;
      border-radius: $m;

      cursor: pointer;
      transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

      .review-content-wrapper {
        display: flex;
        flex-direction: column;

        gap: $xs;

        .comment-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;

          gap: $s;
          padding-bottom: $s;

          .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;

            gap: $m;

            .user-pfp {
              width: 3rem;
              height: 3rem;

              border-radius: 50%;
            }

            .user-details {
              display: flex;
              flex-direction: column;

              .p3 {
                color: $primary-300;
              }
            }
          }

          .report-btn {
            color: $primary-400;
            cursor: pointer;
            user-select: none;

            font-size: 2rem;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
          }
        }

        .star-rating {
          display: inline-flex;

          gap: 0.2rem;

          user-select: none;

          .material-symbols-rounded {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 1.1rem;
            height: 1.1rem;

            font-size: 1.6rem;
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;

            user-select: none;

            &.filled {
              color: $secondary-400;
            }

            &.empty {
              color: $primary-100;
            }
          }
        }
      }

      .date {
        color: $gray-50;
      }

      &:hover {
        box-shadow: $shadow-300;
        transform: translateY(-0.3rem);
      }
    }
  }
}
</style>