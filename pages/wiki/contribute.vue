<template>
    <div>
        <h1>Contribute to the WebToolKit catalogue!</h1>
        <p>Help us make the WebToolKit catalogue better by contributing to it.</p>
        <button @click="openModal">Add a new tool</button>

        <Modal :is-open="isModalOpen" @close="closeModal">
            <p>Enter the name of the tool</p>

            <input v-model="toolName" type="text" placeholder="Name" />
            <NuxtLink :to="`/user/${currentUser}/${toolName}/edit`" @click.prevent="navigateToEdit">
                Next
            </NuxtLink>

            <!-- Error -->
            <div v-if="error">
                <p>Error: {{ error.message }}</p>
                <button @click="retry">Retry</button>
            </div>

            <!-- Data loaded -->
            <template v-else-if="data">
                <!-- Display a list of tools -->
                <div v-for="item in filteredData" :key="item._id" class="tool-item">
                    <p>{{ item.name }}</p>
                </div>

                <!-- Display a message if no tools are found -->
                <p v-if="filteredData.length === 0">No tools found.</p>
            </template>

        </Modal>
    </div>
</template>

<script setup lang="ts">
import type { ItemBasicInfo } from '~/types/types'

const { isModalOpen, openModal, closeModal } = useModal()
const router = useRouter()

const toolName = ref('')

// Temporary placeholder
const currentUser = "Josef"

const navigateToEdit = () => {
    if (toolName.value.trim()) {
        router.push(`/user/${currentUser}/${toolName.value.trim()}/edit`)
        closeModal()
    } else {
        alert('Please enter a tool name')
    }
}

// Fetch data for existing tools
const { data, error, refresh } = useLazyFetch<ItemBasicInfo[]>('/api/data?contribute=true')

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
