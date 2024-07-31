<template>
    <div>
        <h1 v-if="user">Welcome to your dashboard, {{ user.username }}</h1>
        <div v-if="user">
            <p>Username: {{ user.username }}</p>
            <p>Email: {{ user.email }}</p>
            <nuxt-link :to="`user/${user.username}`">View Profile</nuxt-link>
            <!-- Add more user information as needed -->
            <button @click="logout">Log Out</button>
            <button @click="deleteAccount" class="delete-button">Delete Account</button>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
            <router-link to="/auth">Go to login page</router-link>
        </div>
        <p v-else>Loading user information...</p>
    </div>
</template>

<script setup lang="ts">
const user = ref<User | null>(null)
const error = ref<string | null>(null)

const fetchUserInfo = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        error.value = 'You must be logged in to view this page'
        return
    }

    try {
        const response = await fetch('/api/auth/user', {
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

const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return
    }

    const token = localStorage.getItem('token')
    if (!token) {
        error.value = 'You must be logged in to delete your account'
        return
    }

    try {
        const response = await fetch('/api/auth/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.statusMessage || 'Failed to delete account')
        }
        localStorage.removeItem('token')
        user.value = null
        error.value = 'Your account has been deleted successfully.'
    } catch (err) {
        console.error('Error deleting account:', err)
        error.value = err instanceof Error ? err.message : 'An error occurred while deleting your account'
    }
}

onMounted(fetchUserInfo)
</script>

<style scoped>
button {
    margin-top: 1rem;
    margin-left: 1rem;
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

.delete-button {
    background-color: #f00;
    margin-left: 1rem;
}

.delete-button:hover {
    background-color: #d00;
}
</style>