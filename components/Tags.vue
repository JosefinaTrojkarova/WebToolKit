<template>
    <div class="tag-selector">
        <button class="btn__tag" v-for="tag in tags" :key="tag.id" @click="toggleTag(tag)"
            :class="['tag', variant, { active: tag.active }]">
            <Icon :class="iconClass" :name="iconName" size="24" />
            {{ tag.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/types/types'

const props = defineProps({
    tags: {
        type: Array as PropType<Tag[]>,
        default: () => [
            { id: 1, name: 'Tag 1', active: false },
        ]
    },
    variant: {
        type: String,
        default: 'default',
        validator: (value: string) => ['pricing', 'licensing', 'rating', 'default'].includes(value)
    }
})

const toggleTag = (tag: Tag) => {
    tag.active = !tag.active
}

const iconName = computed(() => {
    switch (props.variant) {
        case 'pricing':
            return 'material-symbols:attach-money-rounded'
        case 'licensing':
            return 'material-symbols:license-rounded'
        case 'rating':
            return 'material-symbols:star-outline-rounded'
        default:
            return 'material-symbols:help-outline'
    }
})

const iconClass = computed(() => `icon-${props.variant}`)
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

    font-size: 18px; // ??
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