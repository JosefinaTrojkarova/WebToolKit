<template>
    <div>

    </div>
</template>

<script lang="ts" setup>

</script>

<style></style>


<!-- <template>
    <div v-if="error">
        <p>Error: {{ error.message }}</p>
    </div>
    <div v-else-if="userData">
        <h1>User Profile</h1>
        <p>Username: {{ userData.username }}</p>
        <p>Email: {{ userData.email }}</p>
    </div>
    <div v-else>
        <p>No user data available</p>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const username = computed(() => route.params.username as string)

const { data: userData, error } = await useFetch(`/api/userData/${username.value}`, {
    key: `user-${username.value}`,
    server: false
})
</script> -->