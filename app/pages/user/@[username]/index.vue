<template>
    <div>
        <h1>@{{ username }}</h1>
        <div v-if="data">
            <p>Welcome, {{ data.name }}!</p>
            <img v-if="data.image" :src="data.image" alt="Profile picture" class="profile-image" />
            <p>Email: {{ data.email }}</p>
        </div>
        <div v-else-if="error">
            <p>{{ error.message }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface publicUser {
    username: string;
    name: string;
    email: string;
    image: string;
}

const route = useRoute();
const username = route.params.username as string;

const { data, error } = await useFetch<publicUser>(`/api/user/${username}`, { method: 'GET' });
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
</style>
