<template>
    <div>
        <h1>{{ data?.user?.name }}</h1>
        <div v-if="data">
            <p>Welcome, {{ data?.user?.name }}!</p>
            <img v-if="data?.user?.image" :src="data.user.image" alt="Profile picture" class="profile-image" />
            <p>Email: {{ data?.user?.email }}</p>
            <h2>Profile Functions:</h2>
            <button class="signOut" @click="signOut({ callbackUrl: '/' })">Sign
                Out</button>
            <br>
            <button class="deleteAcc" @click="handleDeleteAccount">
                Delete Account
            </button>
            <br>
            <h3>Saved Tools:</h3>
            <ul>
                <li v-for="(save, index) in saves" :key="index" @click="deleteSave(save)">
                    {{ save }}
                </li>
            </ul>
            <h3>Contributions:</h3>
            <ul>
                <li v-for="(contribution, index) in contributions" :key="contribution._id">
                    <!-- @click="deleteReview(contribution)" -->
                    {{ contribution.toolId }}
                    {{ contribution.comment }}
                    {{ contribution.rating }}
                    {{ contribution.date }}
                </li>
            </ul>
        </div>
        <div v-else>
            <p>You are not logged in.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { data, signOut } = useAuth()
const { deleteAccount } = useAccount()
const { getSaveTool, deleteSaveTool } = useSaveTool();
const { getUserReview } = useReviewTool();

interface Contribution {
    _id: string;
    toolId: string;
    comment: string;
    rating: number;
    date: Date;
}

const email = data.value?.user?.email;
const saves = ref<string[] | null>(null);

const contributions = ref<Contribution[] | null>(null);

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
    const contributionsResult = await getUserReview(email) as Contribution[];
    contributions.value = contributionsResult;
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

// const deleteReview = async (reviewId: string) => {
//     if (!email) return

//     if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
//         try {
//             await deleteReviewTool(email, reviewId)
//             if (contributions.value) {
//                 contributions.value = contributions.value.filter((item) => item !== reviewId);
//             }
//         } catch (e) {
//             console.error('Failed to delete save:', e)
//         }
//     }
// }
</script>

<style scoped lang="scss">
button {
    padding: 20px;
    margin: 10px;
    font-size: 20px;
    font-weight: 800;
    background-color: rgb(255, 101, 101);
    cursor: pointer;
}

li {
    width: fit-content;
    margin: 12px;

    &:hover {
        text-decoration: line-through;
        color: red;
        cursor: pointer;
    }
}
</style>
