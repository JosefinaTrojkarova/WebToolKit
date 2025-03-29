<template>
  <main>
    <header>
      <img v-if="data?.user?.image" :src="data.user.image" alt="Profile picture" class="profile-image"/>
      <section class="user-info">
        <section class="name">
          <h1 class="h2">{{ data?.user?.name }}</h1>
          <p class="username">@{{ username }}</p>
        </section>

        <ul class="details">
          <li class="detail" id="contributions">
            <p class="h4">Contributions:</p>
            <p class="h3">{{ contributions?.length }}</p>
          </li>
          <!--
          <li class="detail" id="member-since">
              <p class="h4">Member Since:</p>
              <p>{{ data?.user?.createdAt }}</p>
          </li>

          <li class="detail" id="join-rank">
              <p class="h4">Join Rank:</p>
              <p>{{ data?.user?.joinRank }}</p>
          </li>
           -->
          <li class="detail" id="stack">
            <p class="h4">Stack:</p>
            <ul class="stack">
              <li v-for="save in saves" :key="save">
                <img :src="data?.user?.image" :alt="save">
              </li>
            </ul>
          </li>
        </ul>

        <!-- Account settings actions -->
        <section v-if="isOwnProfile" class="account-actions">
          <button class="btn--secondary--small sign-out" @click="signOut({ callbackUrl: '/' })">
            <span class="material-symbols-rounded">logout</span>
            Sign Out
          </button>
          <button class="btn--secondary--small delete" @click="handleDeleteAccount">
            <span class="material-symbols-rounded">delete</span>
            Delete Account
          </button>
        </section>
      </section>
    </header>

    <section class="reviews">
      <h2>Reviews:</h2>
      <section class="list">
        <Review v-for="review in contributions" :key="review._id" :data="review"/>
      </section>
    </section>
  </main>
</template>

<script lang="ts" setup>
type PublicUser = {
  user: {
    username: string;
    name: string;
    email: string;
    image: string;
  }
}

interface Contribution {
  _id: string;
  toolId: string;
  comment: string;
  rating: number;
  date: Date;
}

const {data: authData, signOut} = useAuth();
const {deleteAccount} = useAccount();
const {getSaveTool} = useSaveTool();
const {getUserReview} = useReviewTool();

const saves = ref<string[] | null>(null);
const contributions = ref<Contribution[] | null>(null);

const route = useRoute();
const username = route.params.username as string;

const {data, error} = await useFetch<PublicUser>(`/api/user/${username}`);

if (data.value?.user.email) {
  const saveToolResult = await getSaveTool(data.value?.user.email);
  saves.value = saveToolResult?.saves || null;
  const contributionsResult = await getUserReview(data.value?.user.email) as Contribution[];
  contributions.value = contributionsResult;
}

const isOwnProfile = computed(() =>
    authData.value?.user?.email === data.value?.user.email
);

const handleDeleteAccount = async () => {
  const email = authData.value?.user?.email;
  if (!email) return;

  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await deleteAccount(email)
      await signOut({callbackUrl: '/'})
    } catch (e) {
      console.error('Failed to delete account:', e)
    }
  }
};
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 2rem;

  header {
    position: relative;
    display: flex;
    gap: 2rem;

    .profile-image {
      width: 9.375rem;
      height: 9.375rem;
      border-radius: 50%;
      border: 1px solid $primary-200;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .name {
        display: flex;
        flex-direction: column;

        .username {
          color: $primary-300;
        }
      }

      .details {
        display: flex;
        gap: 2rem;

        .detail {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .stack {
            display: flex;

            li {
              list-style-type: none;
              width: 1.3rem;
              transform-origin: center;

              &:nth-child(odd) {
                transform: rotate(-15deg);
              }

              &:nth-child(even) {
                transform: rotate(15deg) translateY(-0.2rem);
              }

              img {
                width: 2rem;
                height: 2rem;
                border-radius: .5rem;
                border: 1px solid $primary-200;
              }
            }
          }
        }
      }
    }

    .account-actions {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      gap: 1rem;

      button {
        gap: .5rem;
      }

      .delete {
        transition: all 0.1s ease-in-out;

        &:hover {
          background-color: $system-error;
          border-color: $system-error;
          color: $system-white;
        }
      }
    }
  }

  .reviews {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
}
</style>
