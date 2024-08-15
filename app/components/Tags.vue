<template>
    <div class="tag-selector">
        <label v-for="tag in computedTags" :key="tag.id" @click="toggleTag(tag)"
            :class="['tag', variant, { active: tag.active }]">
            <span class="material-symbols-rounded tag-icon">{{ iconName }}</span>
            <p class="p2">{{ tag.name }}</p>
        </label>
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
    { id: 1, name: 'Open-Source', active: false },
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

const emit = defineEmits(['tag-toggled']);

const toggleTag = (tag: Tag) => {
    tag.active = !tag.active;
    emit('tag-toggled', { variant: props.variant, tag: tag });
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;

    height: $xxl;
    width: max-content;

    gap: $xs;
    padding-right: $s;

    font-size: 1rem;
    font-weight: 600;

    border-radius: $s;

    cursor: pointer;
    user-select: none;
    transform: rotateX(0deg);
    transition: opacity 0.2s ease-out, transform 0.2s ease-out, background-color 0s linear 0.1s, color 0s linear 0.1s;

    p {
        font-weight: 600;

        transform: rotateX(0deg);
        transition: transform 0s linear 0.1s, color 0s linear 0.1s;
    }

    .tag-icon {
        transform: rotateX(0deg);
        transition: transform 0s linear 0.1s, font-variation-settings 0s linear 0.1s;
    }

    &.pricing {
        border: 2px solid $system-success;

        color: $system-success;

        .tag-icon {
            font-variation-settings:
                'opsz' 24,
                'wght' 400,
                'FILL' 0,
                'GRAD' 100;
            font-size: 1.5rem;
        }

        p {
            color: $system-success;
        }

        &.active {
            color: $system-white;
            background-color: $system-success;
            transform: rotateX(180deg);

            .tag-icon {
                transform: rotateX(180deg);
            }

            p {
                color: $system-white;
                transform: rotateX(180deg);
            }
        }
    }

    &.licensing {
        padding-left: $xs;

        color: $primary-400;

        border: 2px solid $primary-400;

        .tag-icon {
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
            transform: rotateX(180deg);

            .tag-icon {
                transform: rotateX(180deg);
            }

            p {
                color: $system-white;
                transform: rotateX(180deg);
            }
        }
    }

    &.rating {
        padding-right: $xs;
        padding-left: $s;

        color: $primary-400;

        border: 2px solid $primary-400;

        flex-direction: row-reverse;

        .tag-icon {
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
            transform: rotateX(180deg);

            .tag-icon {
                font-variation-settings:
                    'opsz' 20,
                    'wght' 400,
                    'FILL' 1,
                    'GRAD' 100;

                transform: rotateX(180deg);
            }

            p {
                color: $system-white;
                transform: rotateX(180deg);
            }
        }
    }

    &:hover {
        opacity: 70%;
    }
}
</style>