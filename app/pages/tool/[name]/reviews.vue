<template>
  <NuxtLayout name="tool">
    <!-- Error state -->
    <div v-if="reviewsError">
      <p>Error: {{ reviewsError.message }}</p>
      <button @click="retryFetch">Retry</button>
    </div>
    <main v-else-if="reviews && toolData && toolData.rating && isMounted" class="reviews">
      <div class="review-cta">
        <p>Got something to say about {{ reviews.name }}? Leave a review!</p>
        <button class="btn--secondary--small">Leave a Review</button>
      </div>
      <div class="content-wrapper">
        <div class="info">
          <div class="rating">
            <div class="stats">
              <div v-for="(count, rating) in toolData.rating.stats" :key="rating" class="rating-row">
                <p class="label">{{ getLabelForRating(rating) }}</p>
                <div class="bar-background">
                  <div class="bar" :style="{ width: calculateBarWidth(count, toolData.rating.reviews) }"></div>
                </div>
                <p class="count">{{ count }}</p>
              </div>
            </div>
            <div class="stars">
              <h1>{{ toolData.rating.stars.toFixed(1) }}</h1>
              <Stars :rating="toolData.rating.stars"/>
              <p>{{ toolData.rating.reviews }} reviews</p>
            </div>
          </div>
          <div class="tutorial">
            <h4>Pros and Cons are community-driven</h4>
            <p class="upvote"><span class="material-symbols-rounded">shift</span>Upvote if you've encountered the same
              thing.</p>
            <p class="downvote"><span class="material-symbols-rounded">shift</span>Downvote if you completely disagree
              or think it's spam.</p>
            <p class="add"><span class="material-symbols-rounded">add</span>Add a new item if your situation isn't
              present.</p>
          </div>
          <div class="pros-and-cons">
            <div class="pros">
              <p class="pros-header b1"><span class="material-symbols-rounded">thumb_up</span> Pros
              </p>
              <div class="pros-content">
                <div v-for="(pro) in sortItems(toolData.pros)" class="opinion-row">
                  <p>{{ pro.name }}</p>
                  <div class="votes-wrapper">
                    <span class="material-symbols-rounded upvote">shift</span>
                    <p>{{ pro.votes }}</p>
                    <span class="material-symbols-rounded downvote">shift</span>
                  </div>
                </div>
              </div>
              <hr>
              <div class="add">
                <p class="b1">Add</p>
                <span class="material-symbols-rounded">add</span>
              </div>
            </div>
            <div class="cons">
              <p class="cons-header b1"><span class="material-symbols-rounded">thumb_down</span> Cons
              </p>
              <div class="cons-content">
                <div v-for="(con) in sortItems(toolData.cons)" class="opinion-row">
                  <p>{{ con.name }}</p>
                  <div class="votes-wrapper">
                    <span class="material-symbols-rounded upvote">shift</span>
                    <p>{{ con.votes }}</p>
                    <span class="material-symbols-rounded downvote">shift</span>
                  </div>
                </div>
              </div>
              <hr>
              <div class="add">
                <p class="b1">Add</p>
                <span class="material-symbols-rounded">add</span>
              </div>
            </div>
          </div>
        </div>
        <div class="reviews-wrapper">
          <Filters type="reviews" :trigger="490" @filter-toggled="handleFilterToggle"/>
          <div class="reviews">
            <div v-if="reviews.length === 0" class="no-reviews">
              <p>No reviews yet :(</p>
            </div>
            <Review v-else v-for="review in filteredReviews" :data="review" :key="review.date" class="review"></Review>
          </div>
        </div>
      </div>
    </main>
    <!-- Loading state -->
    <div v-else class="loading">
      <h4>One moment please...</h4>
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

// Data fetching
const {reviews, toolData, error: reviewsError, retryFetch: retryReviews} = useFetchReviews()

// Filter
const filterConfig: any = {
  rating: (review: Review, selected: number[]) => selected.some((rating: number) => Math.abs(review.rating - rating) <= 0.5),
};
const {handleFilterToggle, filteredItems: filteredReviews} = useFilters(reviews, filterConfig);

// Retry fetch on error
const retryFetch = () => {
  retryReviews()
}

// Rating
const getLabelForRating = (rating: number) => {
  const labels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Very good',
    3: 'Average',
    2: 'Poor',
    1: 'Terrible'
  }
  return labels[rating] || 'Unknown'
}

const calculateBarWidth = (rating: number, totalReviews: number) => {
  const percentage = (rating / totalReviews) * 100
  return `${percentage}%`
}

type Opinion = {
  name: string
  votes: string
}
const sortItems = (items: Opinion[]) => {
  return items
      .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
}
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  width: 100%;

  padding: 0 $xxl;
  padding-bottom: $xxl;
  gap: $xxl;

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

  .content-wrapper {
    display: flex;
    flex-direction: row;

    width: 100%;

    gap: $xxl;

    .info {
      position: sticky;
      display: flex;
      flex-direction: column;

      top: $xxl;
      padding-top: $xxl + $m;
      gap: $m;

      min-width: fit-content;
      height: fit-content;

      .rating {
        display: flex;
        flex-direction: row;

        gap: $m;

        .stats {
          display: flex;
          flex-direction: column-reverse;

          flex-grow: 1;

          padding: $xl;
          gap: $s;

          border: 1px solid $primary-200;
          border-radius: $m;

          .rating-row {
            display: flex;
            flex-direction: row;
            align-items: center;

            gap: $m;

            .label {
              width: 5.5rem;
            }

            .bar-background {
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;

              height: 0.5rem;
              flex-grow: 1;

              background-color: $primary-100;

              border-radius: 1rem;

              .bar {
                height: 100%;

                background-color: $secondary-400;

                border-radius: 1rem;
              }
            }

            .count {
              width: 2.5rem;
            }
          }
        }

        .stars {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          padding: $xl;
          gap: $xs;

          // Ugly way to force aspect ratio, but aspect-ratio: 1/1; didn't work
          width: 9.872rem;

          border: 1px solid $primary-200;
          border-radius: $m;

          user-select: none;

          h1 {
            height: 5.3rem;
          }
        }
      }

      .tutorial {
        display: flex;
        flex-direction: column;

        padding: $xl;
        gap: $s;

        border: 1px solid $primary-200;
        border-radius: $m;

        .upvote,
        .downvote,
        .add {
          display: flex;
          flex-direction: row;
          align-items: center;

          gap: $s;

          .material-symbols-rounded {
            user-select: none;
            font-size: 1.5rem;
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 32;
          }
        }

        .upvote {
          span {
            color: $secondary-400;
          }
        }

        .downvote {
          span {
            transform: rotateX(180deg);
            color: $primary-400;
          }
        }

        .add {
          span {
            color: $primary-400;
          }
        }
      }

      .pros-and-cons {
        display: grid;
        grid-template-columns: 1fr 1fr;

        width: 100%;

        gap: $m;

        .pros,
        .cons {
          display: flex;
          flex-direction: column;

          min-width: fit-content;
          height: fit-content;

          padding: $xl;
          gap: $s;

          border: 1px solid $primary-200;
          border-radius: $m;

          .pros-header,
          .cons-header {
            display: flex;
            flex-direction: row;
            align-items: center;

            gap: $s;

            .material-symbols-rounded {
              user-select: none;
            }
          }

          .pros-content,
          .cons-content {
            display: flex;
            flex-direction: column;

            min-width: fit-content;
            min-height: max-content;
            max-height: 35vh;

            gap: $s;

            overflow-y: auto;
            scrollbar-width: none;

            .opinion-row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;

              gap: $m;

              p {
                text-wrap: nowrap;
              }

              .votes-wrapper {
                display: flex;
                flex-direction: row;
                align-items: center;

                gap: $xs;

                user-select: none;

                .upvote {
                  color: $primary-200;
                  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                  transition: color 0.2s ease-out;
                  cursor: pointer;

                  &:hover {
                    color: $secondary-400;
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                  }
                }

                .downvote {
                  color: $primary-200;
                  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                  transition: color 0.2s ease-out;
                  cursor: pointer;
                  transform: rotateX(180deg);

                  &:hover {
                    color: $primary-400;
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                  }
                }
              }
            }
          }

          hr {
            width: 100%;
            border: none;
            border-top: 1px solid $primary-200;
          }

          .add {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            width: 100%;

            cursor: pointer;

            .material-symbols-rounded {
              color: $primary-400;
              user-select: none;
            }
          }
        }
      }
    }

    .reviews-wrapper {
      display: flex;
      flex-direction: column;

      width: 100%;

      .reviews {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
        gap: $m;
      }
    }
  }
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 80vh;
  width: 100%;
}
</style>