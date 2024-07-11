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
        </Modal>
    </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped></style>