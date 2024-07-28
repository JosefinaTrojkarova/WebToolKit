<template>
    <div class="tag-selector">
        <button class="btn__tag" v-for="tag in tags" :key="tag.id" @click="toggleTag(tag)"
            :class="['tag', variant, { active: tag.active }]">
            <i :class="getIconClass()" :name="getIconName()" size="24" />
            {{ tag.name }}
        </button>
    </div>
</template>

<script lang="ts">
interface Tag {
    id: number;
    name: string;
    active: boolean;
}

export default defineComponent({
    props: {
        tags: {
            type: Array as PropType<Tag[]>,
            default: () => [
                { id: 1, name: 'Tag 1', active: false },
            ]
        },
        variant: {
            type: String as PropType<'pricing' | 'licensing' | 'rating'>,
            default: 'default',
            validator: (value: string) => ['pricing', 'licensing', 'rating'].includes(value)
        }
    },
    methods: {
        toggleTag(tag: Tag) {
            tag.active = !tag.active
            this.$emit('tag-toggled', tag)
        },
        getIconName(): string {
            switch (this.variant) {
                case 'pricing':
                    return 'material-symbols:attach-money-rounded'
                case 'licensing':
                    return 'material-symbols:license-rounded'
                case 'rating':
                    return 'material-symbols:star-outline-rounded'
                default:
                    return 'material-symbols:help-outline'
            }
        },
        getIconClass() {
            return `icon-${this.variant}`
        }
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