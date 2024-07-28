<template>
    <div class="tag-selector">
        <button v-for="tag in computedTags" :key="tag.id" @click="toggleTag(tag)"
            :class="['tag', variant, { active: tag.active }]">
            <span class="material-symbols-rounded tag__icon">{{ iconName }}</span>
            {{ tag.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    variant: {
        type: String as PropType<'pricing' | 'licensing' | 'rating' | 'default'>,
        default: 'default',
        validator: (value: string) => ['pricing', 'licensing', 'rating', 'default'].includes(value)
    }
})

const pricingTags = ref<Tag[]>([
    { id: 1, name: '100% Free', active: false },
    { id: 2, name: 'Free Version', active: false },
    { id: 3, name: 'Free Trial', active: false },
    { id: 4, name: 'Paid', active: false }
])

const licensingTags = ref<Tag[]>([
    { id: 1, name: 'Open Source', active: false },
    { id: 2, name: 'Proprietary', active: false }
])

const ratingTags = ref<Tag[]>([
    { id: 1, name: '5', active: false },
    { id: 2, name: '4', active: false },
    { id: 3, name: '3', active: false },
    { id: 4, name: '2', active: false },
    { id: 5, name: '1', active: false }
])

const computedTags = computed(() => {
    switch (props.variant) {
        case 'pricing': return pricingTags.value
        case 'licensing': return licensingTags.value
        case 'rating': return ratingTags.value
        default: return [{ id: 1, name: 'Tag 1', active: false }]
    }
})

const toggleTag = (tag: Tag) => {
    tag.active = !tag.active
}

const iconName = computed(() => {
    switch (props.variant) {
        case 'pricing': return 'attach_money'
        case 'licensing': return 'license'
        case 'rating': return 'star'
        default: return 'help'
    }
})
</script>


<style lang="scss" scoped>
.tag-selector {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    gap: $s;
}

.tag {
    display: flex;
    align-items: center;

    height: $xxl;
    width: max-content;

    gap: $xs;
    padding-right: $s;

    font-size: 1rem;
    font-weight: 500;

    border-radius: $s;

    cursor: pointer;

    &.pricing {
        color: $system-success;
        background-color: $system-white;

        border: 2px solid $system-success;

        .tag__icon {
            font-variation-settings:
                'opsz' 24,
                'wght' 400,
                'FILL' 0,
                'GRAD' 100;
            font-size: 1.5rem;
        }

        &.active {
            background-color: $system-success;
            color: $system-white;
        }
    }

    &.licensing {
        padding-left: $xs;

        color: $primary-400;
        background-color: $system-white;

        border: 2px solid $primary-400;

        .tag__icon {
            font-variation-settings:
                'opsz' 20,
                'wght' 400,
                'FILL' 0,
                'GRAD' 100;
            font-size: 1.25rem;
        }

        &.active {
            background-color: $primary-400;
            color: $system-white;
        }
    }

    &.rating {
        padding-right: $xs;
        padding-left: $s;

        color: $primary-400;
        background-color: $system-white;

        border: 2px solid $primary-400;

        flex-direction: row-reverse;

        .tag__icon {
            font-variation-settings:
                'opsz' 20,
                'wght' 400,
                'FILL' 0,
                'GRAD' 100;
            font-size: 1.5rem;
        }

        &.active {
            background-color: $primary-400;
            color: $system-white;
        }
    }
}
</style>