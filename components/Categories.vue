<template>
    <div class="category-selector">
        <button class="btn__category" v-for="category in categories" :key="category.id"
            @click="toggleCategory(category)" :class="['category', { active: category.active }]">
            {{ category.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    categories: Category[]
}>()

const toggleCategory = (category: Category) => {
    category.active = !category.active
}
</script>

<style lang="scss" scoped>
.category-selector {
    display: flex;
    flex-wrap: wrap;

    gap: $s;
}

.category {
    height: $xxl;

    padding: $xs $xl;

    color: $primary-400;

    font-size: 1rem;
    font-weight: 600;

    border: 2px solid $primary-400;
    border-radius: $xxl;

    cursor: pointer;

    &.active {
        background-color: $primary-400;
        color: $system-white;
    }
}
</style>