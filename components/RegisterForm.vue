<template>
  <form @submit.prevent="register">
    <input v-model="username" type="text" placeholder="Username" required>
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <button type="submit">Register</button>
  </form>
  <div v-if="message" class="message">{{ message }}</div>
  <div v-if="error" class="error">{{ error }}</div>
</template>

<script lang="ts" setup>
const username = ref('')
const email = ref('')
const password = ref('')
const message = ref<string | null>(null)
const error = ref<string | null>(null)

interface RegisterResponse {
  message: string
}

const register = async () => {
  message.value = null
  error.value = null

  try {
    const { data, error: fetchError } = await useFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, email: email.value, password: password.value },
    })

    if (fetchError.value) {
      console.error('Registration failed', fetchError.value)
      error.value = fetchError.value.message || 'Registration failed'
    } else if (data.value) {
      console.log(data.value.message)
      message.value = data.value.message

      username.value = ''
      email.value = ''
      password.value = ''
    }
  } catch (e) {
    console.error('Unexpected error', e)
    error.value = 'Unexpected error occurred'
  }
}
</script>