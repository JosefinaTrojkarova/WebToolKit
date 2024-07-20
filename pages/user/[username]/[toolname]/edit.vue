<template>
    <div>
        <h1>Hi {{ username }}! You are editing {{ toolname }}</h1>
        <form @submit.prevent="submitEdit">
            <div>
                <label for="name">Tool Name:</label>
                <input v-model="form.name" type="text" id="name" placeholder="Tool Name" />
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea v-model="form.description" id="description" placeholder="Description"></textarea>
            </div>
            <div>
                <label for="additionalInfo">Additional Info:</label>
                <textarea v-model="form.additionalInfo" id="additionalInfo" placeholder="Additional Info"></textarea>
            </div>
            <button type="submit">Submit Edit</button>
        </form>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { toolname } = route.params
const { username } = route.params

const form = ref({
    name: '',
    description: '',
    additionalInfo: ''
})

// Fetch existing tool data
onMounted(async () => {
    try {
        const response = await fetch(`/api/tool/${toolname}`)
        if (!response.ok) {
            throw new Error('Failed to fetch tool data')
        }
        const toolData = await response.json()
        form.value = {
            name: toolData.name,
            description: toolData.description,
            additionalInfo: toolData.additionalInfo
        }
    } catch (error) {
        console.error('Error fetching tool data:', error)
        alert('Error fetching tool data')
    }
})

const submitEdit = async () => {
    try {
        const response = await fetch('/api/tool/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toolId: toolname,
                editedBy: username,
                ...form.value
            })
        })

        if (!response.ok) {
            throw new Error('Failed to submit edit')
        }

        alert('Edit submitted successfully')
    } catch (error) {
        console.error('Error submitting edit:', error)
        alert('Error submitting edit')
    }
}
</script>

<style scoped></style>