<template>
    <div>
        <h1>Contribute to the WebToolKit catalogue!</h1>
        <p>Help us make the WebToolKit catalogue better by contributing to it.</p>
        <button @click="openModal">Add a new tool</button>

        <Modal :is-open="isModalOpen" @close="closeModal">
            <p>Enter the name of the tool you want to add or edit</p>

            <input v-model="toolName" type="text" placeholder="Name" />
            <NuxtLink :to="editLink" @click.prevent="navigateToEdit">
                Next
            </NuxtLink>

            <!-- Error -->
            <div v-if="fetchError">
                <p>Error: {{ fetchError }}</p>
                <button @click="retry">Retry</button>
            </div>

            <!-- Data loaded -->
            <template v-else-if="data">
                <!-- Display a list of tools -->
                <div v-for="item in filteredData" :key="item._id" class="tool-item">
                    <NuxtLink :to="`/user/${currentUser?.username}/${item.name}/edit`">
                        {{ item.name }}
                    </NuxtLink>
                </div>

                <!-- Display a message if no tools are found -->
                <p v-if="filteredData.length === 0">No tools found.</p>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import type { ItemBasicInfo, User } from '~/types/types'

const { isModalOpen, openModal, closeModal } = useModal()
const router = useRouter()

const toolName = ref('')
const currentUser = ref<User | null>(null)
const fetchError = ref<string | null>(null)

const fetchUserInfo = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        fetchError.value = 'You must be logged in to view this page'
        router.push('/auth')
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
        currentUser.value = data.user
    } catch (err) {
        console.error('Error details:', err)
        fetchError.value = err instanceof Error ? err.message : 'An error occurred'
        router.push('/auth')
    }
}

onMounted(fetchUserInfo)

const navigateToEdit = () => {
    if (toolName.value.trim()) {
        router.push(editLink.value)
        closeModal()
    } else {
        alert('Please enter a tool name')
    }
}

const editLink = computed(() => {
    return `/user/${currentUser.value?.username || 'unknown'}/${toolName.value.trim()}/edit`
})

// Fetch data for existing tools
const { data, refresh } = useLazyFetch<ItemBasicInfo[]>('/api/data?contribute=true')

const retry = () => {
    refresh()
}

// Search functionality
const filteredData = computed(() => {
    if (!data.value || toolName.value.length < 3) return []
    return data.value.filter(item =>
        item.name.toLowerCase().includes(toolName.value.toLowerCase())
    )
})
</script>

<style scoped>
.tool-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0.5rem;
    margin: 0.5rem 0;
}
</style>
