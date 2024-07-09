<template>
    <div>
        <h1>Hi {{ username }}! You are editing {{ toolname }}</h1>
    </div>
</template>

<script setup lang="ts">
const { toolname } = useRoute().params
const { username } = useRoute().params
</script>

<style scoped></style>