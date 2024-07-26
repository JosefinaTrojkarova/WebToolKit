<template>
    <NuxtLink class="card" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
        <div>
            <img src="" alt="">
            <div>
                <h3>{{ item.name }}</h3>
                <div>
                    <p></p>
                    <p></p>
                </div>
                <div>
                    <div class="stars"></div>
                    <p></p>
                    <p></p>
                </div>
            </div>
            <input type="checkbox"">
        </div>
        <div>
            <p>{{ item.description }}</p>
        </div>
        <div>
            <p></p>
            <p></p>
        </div>
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