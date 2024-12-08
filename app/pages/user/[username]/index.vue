<template>
    <div>
        <h1>@{{ username }}</h1>
        <div v-if="error">
            <p>Error: {{ error.message }}</p>
        </div>
        <div v-else-if="data">
            <p>Profile: {{ data.user.name }}</p>
            <img :src="data.user.image" alt="Profile picture" class="profile-image" />
            <h2>saves:</h2>
            <p>{{ saves }}</p>
            <h2>contributions:</h2>
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
    </div>
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

const { getSaveTool } = useSaveTool();
const { getUserReview } = useReviewTool();

const saves = ref<string | null>(null);
const contributions = ref<Contribution[] | null>(null);

const route = useRoute();
const username = route.params.username as string;

const { data, error } = await useFetch<PublicUser>(`/api/user/${username}`);

if (data.value?.user.email) {
    const saveToolResult = await getSaveTool(data.value?.user.email);
    saves.value = saveToolResult?.saves?.join(', ') || null;
    const contributionsResult = await getUserReview(data.value?.user.email) as Contribution[];
    contributions.value = contributionsResult;
}
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

.profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
}
</style>
