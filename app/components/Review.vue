<template>
  <div :class="`review clickable${inProfile ? ' profile-review' : ''}`" @click="handleOpenModal">
    <div class="review-content-wrapper">
      <div v-if="(inProfile || data.tool) && data.tool" class="tool-info">
        <NuxtLink :to="`/tool/${data.tool.name}`" class="tool-link" @click.stop>
          <img :src="data.tool.logo" :alt="data.tool.name" class="tool-logo">
          <span class="tool-name">{{ data.tool.name }}</span>
        </NuxtLink>
      </div>

      <div class="comment-header">
        <NuxtLink :to="`/user/${data.username}`" class="user-info" @click.stop>
          <img :src="data.userProfilePic" alt="pfp" class="user-pfp">
          <div class="user-details">
            <p class="b1">{{ data.name }}</p>
            <p v-if="data.userContributions === 1" class="p3">{{ data.userContributions }} contribution</p>
            <p v-else class="p3">{{ data.userContributions }} contributions</p>
          </div>
        </NuxtLink>
        <!-- <span class="material-symbols-rounded report-btn" title="Report review"
          @click.stop="toggleReportModal">report</span> -->
        <div class="actions">
          <button v-if="canDelete" class="delete-btn" title="Delete review" @click.stop="handleDelete">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </div>
      <div class="star-rating">
        <span v-for="star in 5" :key="star" class="material-symbols-rounded"
          :class="{ 'filled': star <= data.rating, 'empty': star > data.rating }">
          star_rate
        </span>
      </div>
      <p class="comment" :style="`-webkit-line-clamp: ${handleLineLimit}; line-clamp: ${handleLineLimit};`">
        {{ data.comment }}
      </p>
    </div>
    <p class="date p3">{{ formatDate(data.date) }}</p>
    <Modal :is-open="isModalOpen" @close="closeModal">
      <div class="modal">
        <div class="review-content-wrapper">
          <div v-if="(inProfile || data.tool) && data.tool" class="tool-info">
            <NuxtLink :to="`/tool/${data.tool.name}`" class="tool-link">
              <img :src="data.tool.logo" :alt="data.tool.name" class="tool-logo">
              <span class="tool-name">{{ data.tool.name }}</span>
            </NuxtLink>
          </div>
          <div class="comment-header">
            <NuxtLink :to="`/user/${data.username}`" class="user-info">
              <img :src="data.userProfilePic" alt="pfp" class="user-pfp">
              <div class="user-details">
                <p class="b1">{{ data.username }}</p>
                <p v-if="data.userContributions === 1" class="p3">{{ data.userContributions }} contribution</p>
                <p v-else class="p3">{{ data.userContributions }} contributions</p>
              </div>
            </NuxtLink>
            <!-- <span class="material-symbols-rounded report-btn" title="Report review"
              @click="toggleReportModal">report</span> -->
          </div>
          <div class="star-rating">
            <span v-for="star in 5" :key="star" class="material-symbols-rounded"
              :class="{ 'filled': star <= data.rating, 'empty': star > data.rating }">
              star_rate
            </span>
          </div>
          <p>{{ data.comment }}</p>
        </div>
        <p class="date p3">{{ formatDate(data.date) }}</p>
      </div>
    </Modal>
    <!-- <Modal :is-open="isReportModalOpen" @close="toggleReportModal">
      <div class="modal">
        <h1>REPORT!!!</h1>
      </div>
    </Modal> -->
  </div>
</template>

<script lang="ts" setup>
const { data: authData } = useAuth()
const props = defineProps<{
  data: Review & { tool?: { name: string, logo: string } }
  limit?: number
  inProfile?: boolean
}>()

// Check if current user can delete the review
const canDelete = computed(() =>
  authData.value?.user?.email === props.data.userEmail
)

const emit = defineEmits(['deleted'])

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this review?')) return

  try {
    await $fetch('/api/tool/reviews/reviews', {
      method: 'DELETE',
      body: { reviewId: props.data._id }
    })
    emit('deleted', props.data._id)
  } catch (e) {
    console.error('Failed to delete review:', e)
  }
}

const handleOpenModal = () => {
  openModal()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const { isModalOpen, openModal, closeModal } = useModal()
// const isReportModalOpen = ref(false)

// const toggleReportModal = () => {
//   isReportModalOpen.value = !isReportModalOpen.value
// }

const handleLineLimit = ref(props.limit || '')
</script>

<style scoped lang="scss">
.review {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  flex-grow: 1;

  padding: $xl;

  border: 1px solid $primary-200;
  border-radius: $m;
  
  @media (max-width: 768px) {
    padding: $l;
  }
  
  @media (max-width: 480px) {
    padding: $m;
  }
}

.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  &:hover {
    box-shadow: $shadow-300;
    transform: translateY(-0.3rem);
  }
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 50rem;
  min-height: 10rem;
  
  @media (max-width: 768px) {
    width: 90vw;
  }
}

.review-content-wrapper {
  display: flex;
  flex-direction: column;

  gap: $xs;

  .tool-info {
    margin-bottom: $m;
    border-bottom: 1px solid $primary-100;
    padding-bottom: $m;

    .tool-link {
      display: flex;
      align-items: center;
      gap: $s;
      padding: $s;
      text-decoration: none;
      border-radius: $m;
      transition: all 0.2s ease;

      &:hover {
        background-color: $primary-100;
        transform: translateY(-2px);

        .tool-name {
          color: $primary-600;
        }
      }

      .tool-logo {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: $xs;
      }

      .tool-name {
        font-size: 1rem;
        font-weight: 500;
        color: $primary-400;
        transition: color 0.2s ease;
      }
    }
  }

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
      text-decoration: none;
      transition: transform 0.2s ease;
      gap: $m;
      cursor: pointer;
      
      @media (max-width: 480px) {
        gap: $s;
      }

      &:hover {
        transform: translateY(-2px);

        .user-details {
          .b1 {
            color: $primary-600;
          }
        }
      }

      .user-pfp {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        
        @media (max-width: 480px) {
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      .user-details {
        display: flex;
        flex-direction: column;

        .b1 {
          color: $primary-400;
          transition: color 0.2s ease;
        }

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

  .comment {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}

.date {
  color: $gray-50;
  padding-top: $s;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
}

.actions {
  display: flex;
  gap: $xs;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: $xs;
  cursor: pointer;
  color: $primary-300;
  border-radius: $xs;
  transition: all 0.2s ease;

  &:hover {
    color: $system-error;
  }

  .material-symbols-rounded {
    font-size: 1.25rem;
  }
}

.profile-review {
  .review-content-wrapper {
    position: relative;
  }
}
</style>