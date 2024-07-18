<template>
    <div>
        <h1 v-if="user">Welcome to your dashboard, {{ user.username }}</h1>
        <div v-if="user">
            <p>Username: {{ user.username }}</p>
            <p>Email: {{ user.email }}</p>
            <!-- Add more user information as needed -->
            <button @click="logout">Log Out</button>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
            <router-link to="/auth">Go to login page</router-link>
        </div>
        <p v-else>Loading user information...</p>
    </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/types'

const user = ref<User | null>(null)
const error = ref<string | null>(null)

const fetchUserInfo = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        error.value = 'You must be logged in to view this page'
        return
    }

    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.statusMessage || 'Failed to fetch user information')
        }
        const data = await response.json()
        user.value = data.user
    } catch (err) {
        console.error('Error details:', err)
        error.value = err instanceof Error ? err.message : 'An error occurred'
    }
}

const logout = () => {
    localStorage.removeItem('token')
    user.value = null
    error.value = 'You have been logged out.'
}

onMounted(fetchUserInfo)
</script>

<style scoped>
button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #f56;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #d44;
}
</style>
