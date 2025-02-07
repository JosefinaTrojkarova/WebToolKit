<template>
  <main class="settings">
    <div v-if="data" class="settings-container">
      <!-- Profile Section -->
      <section class="profile-section">
        <div class="profile-header">
          <img v-if="data?.user?.image" :src="data.user.image" alt="Profile picture" class="profile-image" />
          <div class="profile-info">
            <h1>{{ data?.user?.name }}</h1>
            <p class="email">{{ data?.user?.email }}</p>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="account-actions">
          <button class="signOut" @click="signOut({ callbackUrl: '/' })">
            <span class="material-symbols-rounded">logout</span>
            Sign Out
          </button>
          <button class="deleteAcc" @click="handleDeleteAccount">
            <span class="material-symbols-rounded">delete</span>
            Delete Account
          </button>
        </div>
      </section>

      <div class="content-grid">
        <!-- Saved Tools Section -->
        <section class="saves-section">
          <h2>Saved Tools</h2>
          <div class="saves-container">
            <p v-if="!saves?.length" class="empty-state">No saved tools yet</p>
            <ul v-else class="saves-list">
              <NuxtLink v-for="(save, index) in saves" :key="index"
                :to="`/tool/${save.toLowerCase().replace(/\s+/g, '-')}`" class="save-item">
                <span class="tool-name">{{ save }}</span>
                <span class="material-symbols-rounded delete-icon" @click.stop="deleteSave(save)">
                  delete
                </span>
              </NuxtLink>
            </ul>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews-section">
          <h2>Your Reviews</h2>
          <div class="reviews-container">
            <p v-if="!reviews?.length" class="empty-state">No reviews yet</p>
            <ul v-else class="reviews-list">
              <li v-for="review in reviews" :key="review._id" class="review-card">
                <div class="review-header">
                  <NuxtLink :to="`/tool/${(review.toolName || review.toolId).toLowerCase().replace(/\s+/g, '-')}`"
                    class="tool-link">
                    <h3>{{ review.toolName || review.toolId }}</h3>
                  </NuxtLink>
                  <div class="rating-group">
                    <span class="rating">{{ review.rating }}/5</span>
                    <span class="material-symbols-rounded delete-icon" @click.stop="deleteUserReview(review._id)">
                      delete
                    </span>
                  </div>
                </div>
                <p class="comment">{{ review.comment }}</p>
                <time class="date">{{ new Date(review.date).toLocaleDateString() }}</time>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
    <div v-else class="not-logged-in">
      <p>You are not logged in.</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
const { data, signOut } = useAuth()
const { deleteAccount } = useAccount()
const { getSaveTool, deleteSaveTool } = useSaveTool();
const { getUserReview, deleteReview } = useReviewTool();
const { getToolName } = useGetToolName();

interface Review {
  _id: string;
  toolId: string;
  toolName?: string;
  comment: string;
  rating: number;
  date: Date;
}

const email = data.value?.user?.email;
const saves = ref<string[] | null>(null);

const reviews = ref<Review[] | null>(null);

const handleDeleteAccount = async () => {
  if (!email) return

  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await deleteAccount(email)
      await signOut({ callbackUrl: '/' })
    } catch (e) {
      console.error('Failed to delete account:', e)
    }
  }
}

if (email) {
  const saveToolResult = await getSaveTool(email);
  saves.value = saveToolResult?.saves || null;

  const contributionsResult = await getUserReview(email) as Review[];

  // Fetch tool names for reviews
  const reviewsWithNames = await Promise.all(
    contributionsResult.map(async (review) => {
      try {
        const toolName = await getToolName(review.toolId);
        return {
          ...review,
          toolName: toolName || review.toolId
        };
      } catch (error) {
        console.error('Error fetching tool name:', error);
        return {
          ...review,
          toolName: review.toolId
        };
      }
    })
  );

  reviews.value = reviewsWithNames;
}

const deleteSave = async (toolName: string) => {
  if (!email) return

  if (confirm('Are you sure you want to delete this save? This action cannot be undone.')) {
    try {
      await deleteSaveTool(email, toolName)
      if (saves.value) {
        saves.value = saves.value.filter((item) => item !== toolName);
      }
    } catch (e) {
      console.error('Failed to delete save:', e)
    }
  }
}

const deleteUserReview = async (reviewId: string) => {
  if (!email) return;

  if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
    try {
      await deleteReview(reviewId);
      if (reviews.value) {
        reviews.value = reviews.value.filter(
          reviews => reviews._id !== reviewId
        );
      }
    } catch (e) {
      console.error('Failed to delete review:', e);
    }
  }
};
</script>

<style scoped lang="scss">
@use 'sass:color';

.settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: $xxl;

  .settings-container {
    display: flex;
    flex-direction: column;
    gap: $xxl;
  }
}

.profile-section {
  background-color: $system-bg;
  border-radius: $m;
  padding: $xl;
  border: 1px solid $primary-200;

  .profile-header {
    display: flex;
    align-items: center;
    gap: $xl;
    margin-bottom: $xl;

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 3px solid $primary-200;
    }

    .profile-info {
      h1 {
        color: $primary-400;
        margin-bottom: $s;
      }

      .email {
        color: $primary-300;
      }
    }
  }

  .account-actions {
    display: flex;
    gap: $m;

    button {
      display: flex;
      align-items: center;
      gap: $s;
      padding: $m $l;
      border-radius: $s;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;

      &.signOut {
        background-color: $primary-400;
        color: white;

        &:hover {
          background-color: $primary-500;
        }
      }

      &.deleteAcc {
        background-color: $system-error;
        color: white;

        &:hover {
          background-color: color.scale($system-error, $lightness: -10%);
        }
      }
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $xl;

  section {
    h2 {
      color: $primary-400;
      margin-bottom: $l;
    }
  }
}

.saves-list,
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: $m;
}

.save-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $m;
  background-color: $system-bg;
  border: 1px solid $primary-200;
  border-radius: $s;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
    background-color: $primary-100;

    .delete-icon {
      opacity: 1;
    }
  }

  .delete-icon {
    opacity: 0.5;
    color: $system-error;
    transition: opacity 0.2s ease;
    padding: $xs;
    cursor: pointer;

    &:hover {
      opacity: 1;
      background-color: rgba($system-error, 0.1);
      border-radius: $xs;
    }
  }
}

.review-card {
  position: relative;
  padding: $l;
  background-color: $system-bg;
  border: 1px solid $primary-200;
  border-radius: $m;
  transition: all 0.2s ease;

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $s;

    .tool-link {
      text-decoration: none;

      h3 {
        color: $primary-400;
        transition: color 0.2s ease;

        &:hover {
          color: $primary-600;
        }
      }
    }

    .rating-group {
      display: flex;
      align-items: center;
      gap: $m;

      .rating {
        color: $secondary-400;
        font-weight: 600;
      }

      .delete-icon {
        color: $system-error;
        opacity: 0.5;
        transition: all 0.2s ease;
        padding: $xs;
        cursor: pointer;

        &:hover {
          opacity: 1;
          background-color: rgba($system-error, 0.1);
          border-radius: $xs;
        }
      }
    }
  }

}

.empty-state {
  text-align: center;
  color: $primary-300;
  padding: $xl;
}

.not-logged-in {
  text-align: center;
  padding: $xxl;
  color: $primary-300;
}
</style>