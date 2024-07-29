<template>
    <div class="tag-selector">
        <label v-for="tag in computedTags" :key="tag.id"
            @click.prevent="toggleTag(tag, $event.currentTarget as HTMLElement)"
            :class="['tag', variant, { active: tag.active }]">
            <input class="default-checkbox" type="checkbox">
            <span class="checkbox">
                <span class="material-symbols-rounded check-icon">check</span>
            </span>
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

const toggleTag = (tag: Tag, target: HTMLElement) => {
    tag.active = !tag.active;

    const input = target.querySelector('input');
    if (input instanceof HTMLInputElement) {
        input.checked = tag.active;
        input.focus();
    }
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
    overflow: hidden;
    user-select: none;

    input[type="checkbox"] {
        display: none;
    }

    .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;

        box-sizing: border-box;

        height: $xl;
        width: $xl;

        background-color: $primary-100;

        border: 0.0625rem solid $primary-200;
        border-radius: $xs;

        transition: border 0.1s ease-out;

        .check-icon {
            opacity: 0;
            visibility: hidden;

            color: $system-white;
            font-size: 0rem;

            transition: font-size 0.2s ease-out, opacity 0.2s ease-out, visibility 0.2s ease-out;
        }
    }

    input:checked~ {
        .checkbox .check-icon {
            opacity: 1;
            visibility: visible;

            font-size: 1.3rem;

            transition-delay: 0.1s;
        }
    }

    input:checked~.checkbox {
        border: 0.8rem solid $primary-400;

        transition: border 0.2s ease-out;
        animation: shrink-bounce 200ms cubic-bezier(.4, .0, .23, 1);
    }

    &:hover .checkbox {
        border: 0.0625rem solid $primary-300;
    }

    @keyframes shrink-bounce {
        0% {
            transform: scale(1);
        }

        33% {
            transform: scale(.9);
        }

        100% {
            transform: scale(1);
        }
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
            background-color: $system-success;
            color: $system-white;

            p {
                color: $system-white;
            }
        }

        .circle {
            background-color: $system-success;
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

            p {
                color: $system-white;
            }
        }

        .circle {
            background-color: $primary-400;
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

            p {
                color: $system-white;
            }
        }

        .circle {
            background-color: $primary-400;
        }
    }

    .circle {
        position: absolute;
        display: none;

        bottom: 0;
        right: 0;

        height: 1rem;
        width: 1rem;

        border-radius: 50%;

        transform: translate(50%, 50%);
    }
}
</style>