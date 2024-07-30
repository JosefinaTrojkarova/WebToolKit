<template>
    <NuxtLink class="card" :to="`/tool/${item.name.toLowerCase().replace(/\s+/g, '-')}`">
        <div class="heading">
            <img class="logo" :src="item.logo" :alt="item.name">
            <div class="content-wrapper">
                <h3 class="tool-name">{{ item.name }}</h3>
                <div class="tags">
                    <div class="tag tag--pricing">
                        <span class="icon material-symbols-rounded">attach_money</span>
                        <p class="text p2">{{ item.tags.pricing }}</p>
                    </div>
                    <div class="tag tag--licensing">
                        <span class="icon material-symbols-rounded">license</span>
                        <p class="text p2">{{ item.tags.licensing }}</p>
                    </div>
                </div>
                <div class="rating">
                    <span class="star-container">
                        <span class="star-fill" :style="{ width: handleRating }">
                            <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
                        </span>
                        <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
                    </span>
                    <p class="p2"><span class="b2">{{ item.rating.reviews }}</span> reviews</p>
                    <p class="p2"><span class="b2">{{ item.rating.saves }}</span> saves</p>
                </div>
            </div>
            <label class="select" @click.stop>
                <input class="checkbox-default" type="checkbox">
                <span class="checkbox">
                    <span class="material-symbols-rounded check-icon">check</span>
                </span>
            </label>
        </div>
        <div class="main">
            <p class="item-description">{{ item.description }}</p>
        </div>
        <div class="categories">
            <span v-for="category in item.categories" :key="category" class="category">
                {{ category }}
            </span>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
    item: ItemBasicInfo
}>()

const handleRating = computed(() => {
    const rating = props.item.rating.stars;
    const starWidth = 19.6; // Each star takes up 18.75% of the total width
    const gapWidth = 0.5; // Each gap is 1.25% of the total width

    // Calculate how many full stars we have
    const fullStars = Math.floor(rating);

    // Calculate the percentage of the last partially filled star
    const partialStar = rating - fullStars;

    // Calculate the total width including gaps up to the current rating
    let totalWidth = (fullStars * starWidth) + (fullStars * gapWidth);

    // Add the partial star width if there is one, but don't add an extra gap after the partial star
    if (partialStar > 0) {
        totalWidth += (partialStar * starWidth);
    }

    // Remove the last gap if we've filled all stars
    if (rating === 5) {
        totalWidth -= gapWidth;
    }

    // Ensure we don't exceed 100%
    totalWidth = Math.min(totalWidth, 100);

    return `${totalWidth}%`;
});
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    display: flex;
    flex-direction: column;

    flex-grow: 1;

    gap: $m;
    padding: $xl;

    text-decoration: none;

    border: 1px solid $primary-200;
    border-radius: $m;

    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

    .heading {
        display: flex;
        gap: $m;

        .logo {
            box-sizing: border-box;

            width: 6.25rem;
            height: 6.25rem;

            padding: $s;

            border: 1px solid $primary-200;
            border-radius: $xl;
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .tags {
                display: flex;

                gap: $l;

                .tag {
                    display: flex;
                    align-items: center;

                    gap: $xs;

                    &--pricing {
                        color: $system-success;

                        .text {
                            color: inherit;
                            font-weight: 600;
                            height: 1.3rem;
                        }

                        .icon {
                            font-size: 1.5rem;
                        }
                    }

                    &--licensing {
                        color: $primary-400;

                        .text {
                            color: inherit;
                            font-weight: 600;
                            height: 1.3rem;
                        }

                        .icon {
                            font-size: 1.25rem;
                        }
                    }

                    .icon {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        width: 1rem;

                        font-variation-settings:
                            'opsz' 20,
                            'wght' 400,
                            'FILL' 0,
                            'GRAD' 100;
                    }
                }
            }

            .rating {
                display: flex;
                flex-direction: row;
                align-items: center;

                gap: $m;

                .star-container {
                    position: relative;
                    display: inline-flex;

                    width: 8rem;

                    .star-fill {
                        display: flex;
                        position: absolute;
                        top: 0;
                        left: 0;

                        height: 100%;

                        overflow: hidden;
                        white-space: nowrap;

                        .star {
                            color: $secondary-400;
                        }
                    }

                    .star {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        width: 1.6rem;

                        color: $primary-100;

                        font-variation-settings:
                            'opsz' 40,
                            'wght' 400,
                            'FILL' 1,
                            'GRAD' 100;
                        font-size: 2rem;
                    }
                }
            }
        }

        .select {
            position: absolute;
            display: block;
            overflow: hidden;

            top: $xl;
            right: $xl;

            height: $xl;
            width: 6.5rem;

            cursor: pointer;

            input[type="checkbox"] {
                display: none;
            }

            .checkbox {
                position: absolute;
                top: 0;
                right: 0;

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

            &::before {
                content: "Compare";

                position: absolute;
                top: $xs;
                right: -2.7rem;

                color: $primary-400;

                transition: right 0.2s ease-out;
            }

            &:hover::before {
                right: 2rem;
                transition: right 0.3s ease-out;
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

            // Optional: Add hover and active states
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
        }
    }

    .main {
        .item-description {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .categories {
        display: flex;
        flex-wrap: wrap;

        gap: $s;

        .category {
            padding: 0.3125rem $xl;
            color: $primary-400;

            font-size: 1rem;
            font-weight: 650;

            border: 2px solid $primary-400;
            border-radius: $xxl;

            cursor: pointer;

            &.active {
                background-color: $primary-400;
                color: $system-white;
            }
        }
    }

    &:hover {
        box-shadow: $shadow-300;
        transform: translateY(-0.3rem);
    }
}
</style>