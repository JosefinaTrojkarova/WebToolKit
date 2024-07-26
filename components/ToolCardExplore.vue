<template>
    <NuxtLink class="card" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { ItemBasicInfo } from '~/types/types'

defineProps<{
    item: ItemBasicInfo
}>()
</script>

<style lang="scss" scoped>
.card {
    width: 43.75rem;

    border: 1px solid #ccc;
    border-radius: 5px;
    text-decoration: none;
    color: inherit;
    display: block;
}
</style>