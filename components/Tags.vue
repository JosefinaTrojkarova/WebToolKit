<template>
    <div class="tag-selector">
        <button class="btn__tag" v-for="tag in computedTags" :key="tag.id" @click="toggleTag(tag)"
            :class="['tag', variant, { active: tag.active }]">
            <span class="material-symbols-rounded">{{ iconName }}</span>
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
    gap: $s;

    font-size: 1.125rem;
    height: $xxl;
    padding: $xs $m;
    font-weight: 500;
    cursor: pointer;
    border-radius: $m;

    &.pricing {
        color: $system-success;
        border: 2px solid $system-success;
        background-color: $system-white;

        &.active {
            background-color: $system-success;
            color: $system-white;
        }
    }

    &.licensing {
        color: $primary-400;
        border: 2px solid $primary-400;
        background-color: $system-white;

        &.active {
            background-color: $primary-400;
            color: $system-white;
        }
    }

    &.rating {
        color: $primary-400;
        border: 2px solid $primary-400;
        background-color: $system-white;

        flex-direction: row-reverse;

        &.active {
            background-color: $primary-400;
            color: $system-white;
        }
    }
}
</style>