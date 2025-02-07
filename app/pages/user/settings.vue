<template>
  <main class="settings">
    <div v-if="data" class="settings-container">
      <section class="profile-section">
        <div class="profile-header">
          <img v-if="data?.user?.image" :src="data.user.image" alt="Profile picture" class="profile-image" />
          <div class="profile-info">
            <h1>{{ data?.user?.name }}</h1>
            <p class="email">{{ data?.user?.email }}</p>
          </div>
        </div>

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

      <UserTools :saves="saves" :reviews="reviews" :can-delete="true" reviews-title="Your Reviews"
        @delete-save="deleteSave" @delete-review="deleteUserReview" />
    </div>
    <div v-else class="not-logged-in">
      <p>You are not logged in.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
const { data, signOut } = useAuth()
const { deleteAccount } = useAccount()
const { getSaveTool, deleteSaveTool } = useSaveTool();
const { getUserReview, deleteReview } = useReviewTool();
const { getToolName } = useGetToolName();

interface SavedTool {
  id: string;
  name: string;
}

interface Review {
  _id: string;
  toolId: string;
  toolName?: string;
  comment: string;
  rating: number;
  date: Date;
}

const email = data.value?.user?.email;
const saves = ref<SavedTool[] | null>(null);
const reviews = ref<Review[] | null>(null);

// Load data if user is logged in
if (email) {
  const saveToolResult = await getSaveTool(email);
  if (saveToolResult?.saves) {
    const savedToolsWithNames = await Promise.all(
      saveToolResult.saves.map(async (toolId: string) => {
        try {
          const toolName = await getToolName(toolId);
          return { id: toolId, name: toolName || toolId };
        } catch (error) {
          console.error('Error fetching tool name:', error);
          return { id: toolId, name: toolId };
        }
      })
    );
    saves.value = savedToolsWithNames;
  }

  const contributionsResult = await getUserReview(email) as Review[];
  const reviewsWithNames = await Promise.all(
    contributionsResult.map(async (review) => {
      try {
        const toolName = await getToolName(review.toolId);
        return { ...review, toolName: toolName || review.toolId };
      } catch (error) {
        console.error('Error fetching tool name:', error);
        return { ...review, toolName: review.toolId };
      }
    })
  );
  reviews.value = reviewsWithNames;
}

const handleDeleteAccount = async () => {
  if (!email) return;
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await deleteAccount(email)
      await signOut({ callbackUrl: '/' })
    } catch (e) {
      console.error('Failed to delete account:', e)
    }
  }
}

const deleteSave = async (toolId: string) => {
  if (!email) return;
  if (confirm('Are you sure you want to delete this save? This action cannot be undone.')) {
    try {
      await deleteSaveTool(email, toolId);
      if (saves.value) {
        saves.value = saves.value.filter((save: SavedTool) => save.id !== toolId);
      }
    } catch (e) {
      console.error('Failed to delete save:', e);
    }
  }
};

const deleteUserReview = async (reviewId: string) => {
  if (!email) return;
  if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
    try {
      await deleteReview(reviewId);
      if (reviews.value) {
        reviews.value = reviews.value.filter((review: Review) => review._id !== reviewId);
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

.not-logged-in {
  text-align: center;
  padding: $xxl;
  color: $primary-300;
}
</style>