<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="register">
            <input v-model="username" type="text" placeholder="Username" required>
            <input v-model="email" type="email" placeholder="Email" required>
            <input v-model="password" type="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

const register = async () => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
        })
        const data = await response.json()
        message.value = data.message
    } catch (error) {
        message.value = 'Registration failed'
    }
}
</script>