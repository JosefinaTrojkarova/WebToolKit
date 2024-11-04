<template>
    <div>
        <h1>{{ data?.user?.name }}</h1>
        <div v-if="data">
            <p>Welcome, {{ data?.user?.name }}!</p>
            <img :src?="data?.user?.image" alt="User Image" />
            <p>Email: {{ data?.user?.email }}</p>
        </div>
        <div v-else>
            <p>You are not logged in.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>

const { data } = useAuth()
</script>

<style></style>
