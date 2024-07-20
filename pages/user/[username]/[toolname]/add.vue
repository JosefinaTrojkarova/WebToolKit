<template>
    <div>
        <h1>Hi {{ username }}! You are adding {{ toolname }}</h1>
        <form @submit.prevent="submitSuggestion">
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
            <button type="submit">Submit Suggestion</button>
        </form>
    </div>
</template>

<script setup lang="ts">
const { toolname } = useRoute().params
const { username } = useRoute().params

const form = ref({
    name: '',
    description: '',
    additionalInfo: ''
})

const submitSuggestion = async () => {
    try {
        const response = await fetch('/api/tool/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toolId: toolname, // assuming toolname is the toolId
                suggestedBy: username,
                ...form.value
            })
        })

        if (!response.ok) {
            throw new Error('Failed to submit suggestion')
        }

        alert('Suggestion submitted successfully')
    } catch (error) {
        console.error('Error submitting suggestion:', error)
        alert('Error submitting suggestion')
    }
}
</script>

<style scoped></style>