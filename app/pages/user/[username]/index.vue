<template>
    <div>
        <h1>@{{ username }}</h1>
        <div v-if="error">
            <p>Error: {{ error.message }}</p>
        </div>
        <div v-else-if="data">
            <p>Profile: {{ data.user.name }}</p>
            <img :src="data.user.image" alt="Profile picture" class="profile-image" />
            <h2>save:</h2>
            <p>{{ saves }}</p>
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

const { getSaveTool } = useSaveTool();

const saves = ref<string | null>(null);

const route = useRoute();
const username = route.params.username as string;

const { data, error } = await useFetch<PublicUser>(`/api/user/${username}`);

if (data.value?.user.email) {
    const saveToolResult = await getSaveTool(data.value?.user.email);
    saves.value = saveToolResult?.saves?.join(', ') || null;
}
</script>

<style scoped>
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
