<template>
    <div>
        <h1>{{ name }}</h1>
        <div v-if="status === 'pending'">Loading...</div>
        <div v-else-if="error">
            <p>Error: {{ error.message }}</p>
            <button @click="retryFetch">Retry</button>
        </div>
        <div v-else-if="data">
            <p>Description: {{ data.description }}</p>
            <!-- Add more fields as needed -->
        </div>
        <NuxtLink v-if="data" :to="`/tool/${name}/edit`">Edit</NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { Tool } from '~/types/types'

const route = useRoute()
const { name } = route.params

const { data, error, status, refresh } = useLazyFetch<Tool>(`/api/tool/${name}`, {
    key: `tool-${name}`,
})

const retryFetch = () => {
    refresh()
}
</script>


<style scoped></style>