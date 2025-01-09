<template>
    <!-- <div>
        <h1>Contribute to the WebToolKit catalogue!</h1>
        <p>Help us make the WebToolKit catalogue better by contributing to it.</p>
        <button @click="openModal">Add or edit a tool</button>

        <Modal :is-open="isModalOpen" @close="closeModal">
            <p>Enter the name of the tool you want to add or edit</p>

            <input v-model="toolName" type="text" placeholder="Name" />
            <button @click="navigateToToolPage">Next</button>

            <div v-if="fetchError">
                <p>Error: {{ fetchError }}</p>
                <button @click="retry">Retry</button>
            </div>

            <template v-else-if="data">
                <div v-for="item in filteredData" :key="item._id" class="tool-item">
                    <button @click="selectExistingTool(item.name)">
                        {{ item.name }}
                    </button>
                </div>

                <p v-if="filteredData.length === 0">No matching tools found. You can add a new tool.</p>
            </template>
</Modal>
</div> -->
</template>



<script lang="ts" setup>
// const { isModalOpen, openModal, closeModal } = useModal()
// const router = useRouter()

// const toolName = ref('')
// const currentUser = ref<User | null>(null)
// const fetchError = ref<string | null>(null)

// const fetchUserInfo = async () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//         fetchError.value = 'You must be logged in to view this page'
//         router.push('/auth')
//         return
//     }

//     try {
//         const response = await fetch('/api/auth/user', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//         if (!response.ok) {
//             const errorData = await response.json()
//             throw new Error(errorData.statusMessage || 'Failed to fetch user information')
//         }
//         const data = await response.json()
//         currentUser.value = data.user
//     } catch (err) {
//         console.error('Error details:', err)
//         fetchError.value = err instanceof Error ? err.message : 'An error occurred'
//         router.push('/auth')
//     }
// }

// onMounted(async () => {
//     await fetchUserInfo()
// })

// const navigateToToolPage = () => {
//     if (toolName.value.trim()) {
//         const isExistingTool = data.value?.some(item => item.name.toLowerCase() === toolName.value.trim().toLowerCase())
//         const path = isExistingTool ? 'edit' : 'add'
//         router.push(`/user/${currentUser.value?.username || 'unknown'}/${toolName.value.trim()}/${path}`)
//         closeModal()
//     } else {
//         alert('Please enter a tool name')
//     }
// }

// const selectExistingTool = (name: string) => {
//     toolName.value = name
//     navigateToToolPage()
// }

// // Fetch data for existing tools
// const { data, refresh } = useLazyFetch<ItemBasicInfo[]>('/api/data?contribute=true', {
//     deep: true
// })

// const retry = () => {
//     refresh()
// }

// // Search functionality
// const filteredData = computed(() => {
//     if (!data.value || toolName.value.length < 3) return []
//     return data.value.filter(item =>
//         item.name.toLowerCase().includes(toolName.value.toLowerCase())
//     )
// })
</script>



<style scoped lang="scss"></style>
