<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit">Log In</button>
    </form>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')

const handleSubmit = () => {
    // Handle login logic here
    console.log('Login attempt:', email.value, password.value)
}
</script>