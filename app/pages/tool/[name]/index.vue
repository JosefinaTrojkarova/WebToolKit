<template>
  <NuxtLayout name="tool">
    <!-- Error state -->
    <div v-if="error">
      <p>Error: {{ error?.message || alternativesError?.message }}</p>
      <button @click="retryFetch">Retry</button>
    </div>
    <!-- Working state -->
    <main v-else-if="isMounted && data">
      <section class="general">
        <div class="info">
          <div class="description">
            <p class="b1">What is {{ data.name }}?</p>
            <p>{{ data.description }}</p>
          </div>
          <div class="info-cards">
            <!-- <div class="rankings">
              <h4>Rankings</h4>
              <h3>#1 in Nevhodne Slovo</h3>
            </div> -->
            <NuxtLink :to="data.pricingLink" target="_blank" title="See current pricing" class="pricing">
              <h4>Pricing <span class="material-symbols-rounded">captive_portal</span></h4>
              <div class="tag--static--pricing">
                <span class="material-symbols-rounded">attach_money</span>
                <p>{{ data.tags?.pricing || 'Not available' }}</p>
              </div>
            </NuxtLink>
            <div class="licensing">
              <h4>Licensing</h4>
              <div class="tag--static--licensing">
                <span class="material-symbols-rounded">license</span>
                <p>{{ data.tags?.licensing || 'Not available' }}</p>
              </div>
            </div>
            <div class="categories">
              <h4>Categories</h4>
              <ul class="wrapper">
                <li v-for="(category, index) in data.categories" :key="index" class="static-category">
                  <p>{{ category }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="banner">
          <iframe v-if="getEmbedUrl" :src="getEmbedUrl" title="YouTube video player" frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
          </iframe>
          <div v-else class="no-video">
            <p>No video available</p>
          </div>
        </div>
      </section>
      <section class="user-sentiment">
        <h3>User Sentiment</h3>
        <div class="user-sentiment-wrapper">
          <div class="sentiment">
            <div class="rating">
              <div class="stats">
                <div v-for="(count, rating) in data.rating.stats" :key="rating" class="rating-row">
                  <p class="label">{{ getLabelForRating(rating) }}</p>
                  <div class="bar-background">
                    <div class="bar" :style="{ width: calculateBarWidth(count, data.rating.reviews) }"></div>
                  </div>
                  <p class="count">{{ count }}</p>
                </div>
              </div>
              <div class="stars">
                <h1>{{ data.rating.stars.toFixed(1) }}</h1>
                <Stars :rating="data.rating.stars" />
                <p>{{ data.rating.reviews }} reviews</p>
              </div>
            </div>
            <div class="pros-and-cons">
              <div class="pros">
                <p class="pros-header b1"><span class="material-symbols-rounded">thumb_up</span> Pros</p>
                <div v-for="(pro) in sortAndLimitItems(data.pros)" :key="pro.name" class="opinion-row">
                  <p>{{ pro.name }}</p>
                </div>
              </div>
              <div class="cons">
                <p class="cons-header b1"><span class="material-symbols-rounded">thumb_down</span> Cons</p>
                <div v-for="(con) in sortAndLimitItems(data.cons)" :key="con.name" class="opinion-row">
                  <p>{{ con.name }}</p>
                </div>
              </div>
              <NuxtLink :to="`${data.name.toLowerCase().replace(/\s+/g, '-')}/reviews`" class="contribute-btn">
                <p>Contribute</p>
              </NuxtLink>
            </div>
          </div>
          <div class="reviews">
            <div class="review-cta">
              <p>Got something to say about {{ data.name }}? Leave a review!</p>
              <button class="btn--secondary--small" @click="openModal">
                Leave a Review
              </button>
              <Modal :is-open="isModalOpen" @close="closeModal">
                <LeaveReview v-if="status == 'authenticated'" :tool-name="data.name" :tool-id="data._id"
                  @review-submitted="handleReviewSubmitted" />
                <SignIn v-else />
              </Modal>
            </div>
            <ul class="review-wrapper">
              <div v-if="reviews.length === 0" class="no-reviews">
                <p>No reviews yet :(</p>
              </div>
              <Review v-else v-for="review in reviews" :key="review._id" :data="review" class="review"
                @deleted="handleReviewDeleted" />
            </ul>
            <NuxtLink :to="`${data.name.toLowerCase().replace(/\s+/g, '-')}/reviews`" class="view-reviews-btn">
              <p>View All</p>
            </NuxtLink>
          </div>
        </div>
      </section>
      <section class="alternatives">
        <h3>Popular Alternatives</h3>
        <div class="content">
          <ToolCard v-if="mainTool" :data="mainTool" :main="true" />
          <ToolCard v-for="alt in alternatives.slice(0, 3)" :key="alt._id" :data="alt" />
        </div>
        <NuxtLink :to="`${data.name.toLowerCase().replace(/\s+/g, '-')}/alternatives`" class="view-alternatives-btn">
          <p>View All</p>
        </NuxtLink>
      </section>
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

const { status } = useAuth()

// Setup the route and data fetching
const route = useRoute()
const { name } = route.params

const { data, error, retryFetch: retryToolData } = useFetchToolData(name as string)
const { alternatives, mainTool, error: alternativesError, retryFetch: retryAlternatives } = useFetchAlternatives(
  data?.value?._id,
  data?.value?.alternatives,
  3
)
const { reviews, retryReviews } = useFetchReviews(data?.value?._id, 3)

const retryFetch = () => {
  retryToolData()
  retryAlternatives()
  retryReviews()
}

const getEmbedUrl = computed(() => {
  if (!data.value?.video) return null;

  const url = new URL(data.value.video);
  const videoId = url.searchParams.get('v');

  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
});

const { isModalOpen, openModal, closeModal } = useModal()

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
const sortAndLimitItems = (items: Opinion[]) => {
  return items
    .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
    .slice(0, 4);
}

const handleReviewSubmitted = () => {
  retryReviews();
  retryToolData()
  closeModal();
};

const handleReviewDeleted = async (reviewId: string) => {
  reviews.value = reviews.value.filter((review: { _id: string }) => review._id !== reviewId)

  await retryToolData()
}
</script>


<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;

  gap: $xxl;
  padding: 0 $xxl;
  padding-bottom: $xxl;

  .general {
    display: flex;
    flex-direction: row;

    width: 100%;

    gap: $xl;

    .info {
      display: flex;
      flex-direction: column;

      flex-grow: 1;

      gap: $m;

      .description {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        flex-grow: 1;
        width: 100%;

        gap: $s;
        padding: $xl;

        border: 1px solid $primary-200;
        border-radius: $m;
      }

      .info-cards {
        display: flex;
        flex-direction: row;

        width: 100%;

        gap: $m;

        .rankings,
        .pricing,
        .licensing {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;

          min-width: 12.5rem;
          height: 12.5rem;

          padding: $xl;

          border: 1px solid $primary-200;
          border-radius: $m;

          h3 {
            display: flex;
            text-wrap: pretty;
          }
        }

        .pricing {
          user-select: none;
          transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

          h4 {
            display: flex;
            justify-content: space-between;

            width: 100%;

            span {
              transform: rotateY(180deg);
            }
          }

          .tag--static--pricing {
            cursor: pointer;
          }

          &:hover {
            box-shadow: $shadow-300;
            transform: translateY(-0.3rem);
          }
        }

        .categories {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;

          flex-grow: 1;

          padding: $xl;

          border: 1px solid $primary-200;
          border-radius: $m;

          .wrapper {
            display: flex;
            flex-wrap: wrap-reverse;

            gap: $s;
          }
        }
      }
    }

    .banner {
      display: flex;
      overflow: hidden;
      height: 23.125rem;
      min-width: 41.1rem;

      border: 1px solid $primary-200;
      border-radius: $m;

      iframe {
        width: 100%;
        height: 100%;
      }

      .no-video {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: $primary-100;
      }
    }
  }

  .resources {
    display: flex;
    flex-direction: column;

    width: 100%;

    gap: $m;

    .resources-wrapper {
      display: grid;
      grid-template-columns: repeat(5, minmax(20rem, 1fr));
      width: 100%;
      height: 30rem;

      gap: $m;
    }

    .view-resources-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      width: 100%;

      padding: $m;

      border: 1px solid $primary-200;
      border-radius: $m;

      cursor: pointer;
      transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

      &:hover {
        box-shadow: $shadow-300;
        transform: translateY(-0.3rem);
      }
    }
  }

  .user-sentiment {
    display: flex;
    flex-direction: column;

    width: 100%;

    gap: $m;

    .user-sentiment-wrapper {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;

      width: 100%;

      gap: $xxl;

      .sentiment {
        display: flex;
        flex-direction: column;

        gap: $m;

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

            aspect-ratio: 1 / 1;

            border: 1px solid $primary-200;
            border-radius: $m;

            user-select: none;

            h1 {
              height: 5.3rem;
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

          .contribute-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;

            grid-column: span 2;

            padding: $m;

            border: 1px solid $primary-200;
            border-radius: $m;

            cursor: pointer;
            transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

            &:hover {
              box-shadow: $shadow-300;
              transform: translateY(-0.3rem);
            }
          }
        }
      }

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

          .no-reviews {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 100%;
            height: 100%;
          }

          .review {
            flex: 1;
          }
        }

        .view-reviews-btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;

          padding: $m;

          border: 1px solid $primary-200;
          border-radius: $m;

          cursor: pointer;
          transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

          &:hover {
            box-shadow: $shadow-300;
            transform: translateY(-0.3rem);
          }
        }
      }
    }
  }

  .alternatives {
    display: flex;
    flex-direction: column;
    gap: $m;

    .content {
      display: grid;
      grid-template-columns: repeat(4, minmax(20rem, 1fr));
      gap: $m;
    }

    .view-alternatives-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;

      padding: $m;

      border: 1px solid $primary-200;
      border-radius: $m;

      cursor: pointer;
      transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

      &:hover {
        box-shadow: $shadow-300;
        transform: translateY(-0.3rem);
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