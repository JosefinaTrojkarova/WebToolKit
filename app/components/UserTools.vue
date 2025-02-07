<template>
  <div class="content-grid">
    <!-- Saved Tools Section -->
    <section class="saves-section">
      <h2>Saved Tools</h2>
      <div class="saves-container">
        <p v-if="!saves?.length" class="empty-state">No saved tools yet</p>
        <ul v-else class="saves-list">
          <NuxtLink v-for="save in saves" :key="save.id" :to="`/tool/${save.name.toLowerCase().replace(/\s+/g, '-')}`"
            class="save-item">
            <div class="save-header">
              <h3 class="tool-name">{{ save.name }}</h3>
              <div class="actions">
                <span v-if="canDelete" class="material-symbols-rounded delete-icon"
                  @click.stop="$emit('deleteSave', save.id)">
                  delete
                </span>
                <span v-else class="material-symbols-rounded">chevron_right</span>
              </div>
            </div>
          </NuxtLink>
        </ul>
      </div>
    </section>

    <!-- Reviews/Contributions Section -->
    <section class="reviews-section">
      <h2>{{ reviewsTitle }}</h2>
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
                <span v-if="canDelete" class="material-symbols-rounded delete-icon"
                  @click.stop="$emit('deleteReview', review._id)">
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
</template>

<script lang="ts" setup>
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

defineProps<{
  saves: SavedTool[] | null;
  reviews: Review[] | null;
  canDelete?: boolean;
  reviewsTitle?: string;
}>();

defineEmits<{
  (e: 'deleteSave', id: string): void;
  (e: 'deleteReview', id: string): void;
}>();
</script>

<style scoped lang="scss">
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
  display: block;
  padding: $l;
  background-color: $system-bg;
  border: 1px solid $primary-200;
  border-radius: $m;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-300;
    background-color: $primary-100;

    .delete-icon {
      opacity: 1;
    }
  }

  .save-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tool-name {
      color: $primary-400;
      font-size: 1.1rem;
      font-weight: 500;
      transition: color 0.2s ease;
      margin: 0;

      &:hover {
        color: $primary-600;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: $m;

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

      .material-symbols-rounded {
        color: $primary-300;
      }
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-300;
  }

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

  .comment {
    margin-bottom: $l;
    color: $primary-300;
    line-height: 1.5;
  }

  .date {
    display: block;
    color: $primary-200;
    font-size: 0.9rem;
  }
}

.empty-state {
  text-align: center;
  color: $primary-300;
  padding: $xl;
}
</style>