<template>
    <div>
        <h1 v-if="user">Account settings for {{ user.username }}</h1>
        <div v-if="user">
            <p>Username: {{ user.username }}</p>
            <p>Email: {{ user.email }}</p>
            <!-- Add more user information as needed -->
        </div>
        <p v-else-if="error">{{ error }}</p>
        <p v-else>Loading user information...</p>
    </div>
</template>

<script setup lang="ts">
interface User {
    id: string;
    username: string;
    email: string;
}

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

onMounted(fetchUserInfo)
</script>