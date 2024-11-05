<template>
  <div :class="`review clickable`" @click="handleOpenModal">
    <div class="review-content-wrapper">
      <div class="comment-header">
        <NuxtLink :to="`/user/@${data.userHandle}`" class="user-info">
          <img :src="data.userProfilePic" alt="pfp" class="user-pfp">
          <div class="user-details">
            <p class="b1">{{ data.username }}</p>
            <p v-if="data.userContributions === 1" class="p3">{{ data.userContributions }} contribution</p>
            <p v-else class="p3">{{ data.userContributions }} contributions</p>
          </div>
        </NuxtLink>
        <!-- <span class="material-symbols-rounded report-btn" title="Report review"
          @click.stop="toggleReportModal">report</span> -->
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
          <div class="comment-header">
            <NuxtLink :to="`/user/@${data.userHandle}`" class="user-info">
              <img :src="data.userProfilePic" alt="pfp" class="user-pfp">
              <div class="user-details">
                <p class="b1">{{ data.username }}</p>
                <p class="p3">{{ data.userContributions }}</p>
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
const props = defineProps<{
  data: Review
  // Prop to set the maximum number of lines of text to display, if not set, all lines will be displayed and no modal will be openable
  limit?: number
}>()

const clickable = props.limit ? 'clickable' : ''

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
}

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

      cursor: pointer;

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

  .comment {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}

.date {
  color: $gray-50;
  padding-top: $s;
}
</style>