<template>
    <div class="category-selector">
        <button class="btn__category" v-for="category in categories" :key="category.id"
            @click="toggleCategory(category)" :class="['category', { active: category.active }]">
            <p class="p2">{{ category.name }}</p>
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

    font-size: 1rem;
    font-weight: 600;

    border: 2px solid $primary-400;
    border-radius: $xxl;

    cursor: pointer;
    transform: rotateX(0deg);
    transition: opacity 0.2s ease-out, transform 0.2s ease-out, background-color 0s linear 0.1s;

    p {
        font-weight: 600;
        transform: rotateX(0deg);
        transition: transform 0s linear 0.1s, color 0s linear 0.1s;
    }

    &.active {
        background-color: $primary-400;
        transform: rotateX(180deg);

        p {
            color: $system-white;
            transform: rotateX(180deg);
        }
    }

    &:hover {
        opacity: 0.8;
    }
}
</style>