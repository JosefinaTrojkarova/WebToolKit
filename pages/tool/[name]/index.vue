<template>
    <div>
        <h1>{{ name }}</h1>
        <div v-if="error">{{ error }}</div>
        <div v-else-if="data">
            <p>Description: {{ data.description }}</p>
            <!-- Add more fields as needed -->
        </div>
        <NuxtLink :to="`/tool/${name}/edit`">Edit</NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { Tool } from '~/types/types'

const route = useRoute()
const { name } = route.params

const { data, error } = await useFetch<Tool>(`/api/tool/${name}`, {
    key: `tool-${name}`,
})
</script>

<style scoped></style>