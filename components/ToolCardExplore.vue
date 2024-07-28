<template>
    <NuxtLink class="card" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
        <div class="card__heading">
            <img class="card__logo" :src="item.logo" :alt="item.name">
            <div>
                <h3 class="card__name">{{ item.name }}</h3>
                <div class="card__tags">
                    <div class="card__pricing tag">
                        <Icon class="pricing__icon" name="material-symbols:attach-money-rounded" size="24" />
                        <p class="price">{{ item.tags.pricing }}</p>
                    </div>
                    <div class="card__licensing tag">
                        <Icon class="licensing__icon" name="material-symbols:license-rounded" size="24" />
                        <p class="license">{{ item.tags.licensing }}</p>
                    </div>
                </div>
                <div class="card__rating tag">
                    <div class="rating__stars">
                        <span v-for="i in 5" :key="i" class="star-container">
                            <Icon v-if="i <= Math.floor(item.rating.stars)" class="stars__icon filled"
                                name="material-symbols:star-rounded" size="24" />
                            <Icon v-else-if="i - 0.5 <= item.rating.stars" class="stars__icon half-filled"
                                name="material-symbols:star-half-rounded" size="24" />
                            <Icon v-else class="stars__icon empty" name="material-symbols:star-outline-rounded"
                                size="24" />
                        </span>
                    </div>
                    <p class="rating__reviews"><span class="reviews">{{ item.rating.reviews }}</span> reviews</p>
                    <p class="rating__saves"><span class="saves">{{ item.rating.saves }}</span> saves</p>
                </div>
            </div>
            <label class="select" @click.stop>
                <input class="select__checkbox" type="checkbox">
                <span class="checkbox-container"></span>
            </label>
        </div>
        <div class="card__main">
            <p>{{ item.description }}</p>
        </div>
        <div class="card__categories">
            <span v-for="category in item.categories" :key="category" class="category">
                {{ category }}
            </span>
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

    display: flex;
    flex-direction: column;
    gap: $m;


    .card__heading {
        display: flex;
        gap: $m;

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

        .card__logo {
            width: 6.25rem;
            height: 6.25rem;
            border: 1px solid $primary-200;
            border-radius: $xl;

        }

        .tag {
            display: flex;
            align-items: center;
            gap: $s;
        }

        .card__tags {
            display: flex;
            gap: $l;

            .card__pricing {
                color: $system-success;

                .price {
                    color: inherit;
                    font-weight: 500;
                }
            }

            .card__licensing {
                color: $primary-400;

                .license {
                    color: inherit;
                    font-weight: 500;
                }
            }

        }

        .card__rating {
            gap: $m;

            .reviews,
            .saves {
                font-weight: 700;
            }

            .stars__icon {
                color: $secondary-400;
            }
        }

    }
}



.card__categories {
    display: flex;
    flex-wrap: wrap;
    gap: $s;


    .category {
        font-size: 18px; //??
        padding: $xs+0.0625rem $xl;
        color: $primary-400;
        font-weight: 500;
        border: 2px solid $primary-400;
        background-color: $system-white;
        cursor: pointer;
        border-radius: $xxl;

        &.active {
            background-color: $primary-400;
            color: $system-white;
        }
    }
}
</style>