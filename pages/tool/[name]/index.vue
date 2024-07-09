<template>
    <div>
        <h1>{{ name }}</h1>
        <!-- Fill this properly from database -->
        <NuxtLink :to="`/tool/${name}/edit`">Edit</NuxtLink>
    </div>
</template>

<script setup lang="ts">
const { name } = useRoute().params
</script>

<style scoped></style>