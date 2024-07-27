<template>
    <NuxtLink class="card" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
        <div class="card__heading">
            <img class="card__logo" :src="item.logo" :alt="item.name">
            <div>
                <h3 class="card__name">{{ item.name }}</h3>
                <div v-if="item.tag">
                    <div>
                        <Icon class="pricing__icon" name="material-symbols:attach-money-rounded" size="18" />
                        <p>{{ item.tag.pricing }}</p>
                    </div>
                    <div>
                        <Icon class="licensing__icon" name="material-symbols:license-rounded" size="18" />
                        <p>{{ item.tag.licensing }}</p>
                    </div>
                </div>
                <div v-if="item.tag && item.tag.rating !== undefined">
                    <div class="stars">
                        <span v-for="i in 5" :key="i" :class="{ 'filled': i <= Math.round(item.tag.rating) }">★</span>
                    </div>
                    <p>{{ item.tag.rating }}</p>
                </div>
            </div>
            <label class="select" @click.stop>
                <input type="checkbox">
                <span class="checkbox-container"></span>
            </label>
        </div>
        <div class="card__main">
            <p>{{ item.description }}</p>
        </div>
        <div class="card__tags">
            <!-- Add any additional tags here if needed -->
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
    position: relative;
    width: 43.75rem;
    padding: $xl;

    border: 1px solid $primary-200;
    border-radius: $m;
    text-decoration: none;
    color: inherit;
    display: block;

    .card__heading {
        display: flex;

        .select {
            position: absolute;
            top: $xl;
            right: $xl;

            display: block;
            cursor: pointer;

            input[type="checkbox"] {
                visibility: hidden;
            }

            .checkbox-container {
                position: absolute;
                top: 0;
                left: 0;
                height: $xl;
                width: $xl;
                background-color: $primary-100;
                border: 1px solid $primary-200;
                border-radius: $s;
            }

            /* Hover effect 
            &:hover input~.checkbox-container {}

            Active effect
            input:active~.checkbox-container {}

            Checked effect
            input:checked~.checkbox-container {}
            change*/
            .checkbox-container::after {
                content: "";
                position: absolute;
                display: none;
                left: 0.4rem;
                width: 0.5rem;
                height: 1rem;
                border: solid black;
                border-width: 0 0.2rem 0.2rem 0;
                transform: rotate(45deg);
            }

            input:checked~.checkbox-container::after {
                display: block;
            }
        }
    }

    .card__logo {
        width: 6.25rem;
        height: 6.25rem;
        border: 1px solid $primary-200;
        border-radius: $xl;

    }
}
</style>