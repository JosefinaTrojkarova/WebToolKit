<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="login">
            <input v-model="email" type="email" placeholder="Email" required>
            <input v-model="password" type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const message = ref('')

const login = async () => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        })
        const data = await response.json()
        if (response.ok) {
            message.value = 'Login successful'

            localStorage.setItem('token', data.token)
        } else {
            message.value = data.statusMessage || 'Login failed'
        }
    } catch (error) {
        message.value = 'Login failed'
    }
}
</script>