<template>
    <div>
        <!-- Fill this properly from database -->

        <!-- Placeholder -->
        <input type="text" placeholder="Name of the tool" :value="name" />
        <input type="text" placeholder="Description of the tool" />
    </div>
</template>

<script setup lang="ts">
const { name } = useRoute().params;
</script>

<style scoped></style>