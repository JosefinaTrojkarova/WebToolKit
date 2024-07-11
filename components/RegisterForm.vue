<template>
  <form @submit.prevent="register">
    <input v-model="username" type="text" placeholder="Username" required>
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <button type="submit">Register</button>
  </form>
</template>

<script lang="ts" setup>
const username = ref('')
const email = ref('')
const password = ref('')

interface RegisterResponse {
  message: string
}

const register = async () => {
  try {
    const { data, error } = await useFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, email: email.value, password: password.value },
    })

    if (error.value) {
      console.error('Registration failed', error.value)
    } else if (data.value) {
      console.log(data.value.message)
    }
  } catch (e) {
    console.error('Unexpected error', e)
  }
}
</script>