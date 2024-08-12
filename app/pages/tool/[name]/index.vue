<template>
    <NuxtLayout name="tool">
        <!-- Error state -->
        <div v-if="error">
            <p>Error: {{ error.message }}</p>
            <button @click="retryFetch">Retry</button>
        </div>
        <!-- Working state -->
        <main v-else-if="isMounted && data">
            <!-- <div class="question-notification"></div> -->
            <section class="general">
                <div class="info">
                    <div class="description">
                        <p class="b1">What is {{ data.name }}?</p>
                        <p>{{ data.description }}</p>
                    </div>
                    <div class="info-cards">
                        <div class="rankings">
                            <h4>Rankings</h4>
                            <h3>#1 in Sex</h3>
                        </div>
                        <NuxtLink :to="data.pricingLink" target="_blank" class="pricing">
                            <h4>Pricing <span class="material-symbols-rounded">captive_portal</span></h4>
                            <button class="tag--static--pricing">
                                <span class="material-symbols-rounded">attach_money</span>
                                <p>{{ data.tags?.pricing || 'Not available' }}</p>
                            </button>
                        </NuxtLink>
                        <div class="licensing">
                            <h4>Licensing</h4>
                            <button class="tag--static--licensing">
                                <span class="material-symbols-rounded">license</span>
                                <p>{{ data.tags?.licensing || 'Not available' }}</p>
                            </button>
                        </div>
                        <div class="categories">
                            <h4>Categories</h4>
                            <ul class="wrapper">
                                <li v-for="(category, index) in data.categories" :key="index" class="static-category">
                                    <p>{{ category }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="banner">
                    <!-- Temporary solution, needs improvement -->
                    <iframe src="https://www.youtube.com/embed/Cx2dkpBxst8?si=tdXp6g5WOCc632tr"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            </section>
            <section class="resources">
                <h3>Resources</h3>
                <ul class="resources-wrapper" @wheel.prevent="onScroll">
                    <ResourceCard v-for="(resource, index) in data.resources.slice(0, 5)" :key="index"
                        :link="resource.link" :type="resource.type">
                    </ResourceCard>
                </ul>
                <NuxtLink :to="`${data.name}/resources`" class="view-resources-btn">
                    <p>View All</p>
                </NuxtLink>
            </section>
            <section class="user-sentiment">
                <h3>User Sentiment</h3>
                <div class="user-sentiment-wrapper">
                    <div class="sentiment">
                        <div class="rating">
                            <div class="stats">
                                <div v-for="(count, rating) in data.rating.stats" :key="rating" class="rating-row">
                                    <p class="label">{{ getLabelForRating(rating) }}</p>
                                    <div class="bar-background">
                                        <div class="bar"
                                            :style="{ width: calculateBarWidth(count, data.rating.reviews) }"></div>
                                    </div>
                                    <p class="count">{{ count }}</p>
                                </div>
                            </div>
                            <div class="stars">
                                <h1>{{ data.rating.stars.toFixed(1) }}</h1>
                                <span class="star-container">
                                    <span class="star-fill" :style="{ width: useCalculateRating(data.rating.stars) }">
                                        <span v-for="i in 5" :key="i"
                                            class="star material-symbols-rounded">star_rate</span>
                                    </span>
                                    <span v-for="i in 5" :key="i" class="star material-symbols-rounded">star_rate</span>
                                </span>
                                <p>{{ data.rating.reviews }} reviews</p>
                            </div>
                        </div>
                        <div class="pros-and-cons">
                            <div class="pros">
                                <p class="pros-header b1"><span class="material-symbols-rounded">thumb_up</span> Pros
                                </p>
                                <div v-for="(pro) in sortAndLimitItems(data.pros)" class="opinion-row">
                                    <p>{{ pro.name }}</p>
                                    <div class="votes-wrapper">
                                        <span class="material-symbols-rounded upvote">shift</span>
                                        <p>{{ pro.votes }}</p>
                                        <span class="material-symbols-rounded downvote">shift</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cons">
                                <p class="cons-header b1"><span class="material-symbols-rounded">thumb_down</span> Cons
                                </p>
                                <div v-for="(con) in sortAndLimitItems(data.cons)" class="opinion-row">
                                    <p>{{ con.name }}</p>
                                    <div class="votes-wrapper">
                                        <span class="material-symbols-rounded upvote">shift</span>
                                        <p>{{ con.votes }}</p>
                                        <span class="material-symbols-rounded downvote">shift</span>
                                    </div>
                                </div>
                            </div>
                            <NuxtLink :to="`${data.name}/reviews`" class="contribute-btn">
                                <p>Contribute</p>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="reviews">
                        <div class="review-cta">
                            <p>Got something to say about {{ data.name }}? Leave a review!</p>
                            <button class="btn--secondary--small">Leave a Review</button>
                        </div>
                        <ul class="review-wrapper">
                            <li v-for="review in reviews" :key="review._id" class="review">
                                <div class="review-content-wrapper">
                                    <div class="comment-header">
                                        <div class="user-info">
                                            <img src="https://play-lh.googleusercontent.com/L5OfSFUWZlLLgBrexrjWyIbKgFAzzuepGEmO6erE-9766GFA3hxRahjF2oshJZrHFw=w1400-h720"
                                                alt="pfp" class="user-pfp">
                                            <div class="user-details">
                                                <p class="b1">{{ review.user }}</p>
                                                <p class="p3">15 contributions</p>
                                            </div>
                                        </div>
                                        <span class="material-symbols-rounded report-btn">report</span>
                                    </div>
                                    <div class="star-rating">
                                        <span v-for="star in 5" :key="star" class="material-symbols-rounded"
                                            :class="{ 'filled': star <= review.rating, 'empty': star > review.rating }">
                                            star_rate
                                        </span>
                                    </div>
                                    <p>{{ review.comment }}</p>
                                </div>
                                <p class="date p3">{{ new Date(review.date).toLocaleDateString() }}</p>
                            </li>
                        </ul>
                        <NuxtLink :to="`${data.name}/reviews`" class="view-reviews-btn">
                            <p>View All</p>
                        </NuxtLink>
                    </div>
                </div>
            </section>
            <section class="alternatives">
                <h3>Popular Alternatives</h3>
                <div class="content">
                    <div class="alternative" id="current-tool">
                        <img :src="data.logo" :alt="data.name" width="20" height="20" />
                        {{ data.name }} - {{ data.shortDescription }}
                        <Categories :categories="data.categories" />
                        <br>
                        Pricing: {{ data.tags.pricing }}, Licensing: {{ data.tags.licensing }}
                        <br>
                        Rating: {{ data.rating.stars }} stars ({{ data.rating.reviews }} reviews)
                        <br>
                        <p>Pros:</p>
                        <ul>
                            <li v-for="(pro, index) in data.pros" :key="index">
                                {{ pro.name }} ({{ pro.votes }} votes)
                            </li>
                        </ul>
                        <p>Cons:</p>
                        <ul>
                            <li v-for="(con, index) in data.cons" :key="index">
                                {{ con.name }} ({{ con.votes }} votes)
                            </li>
                        </ul>
                    </div>
                    <NuxtLink class="alternative" v-for="alt in alternatives.slice(0, 3)" :key="alt._id"
                        :to="`/tool/${alt.name.toLowerCase()}`">
                        <img :src="alt.logo" :alt="alt.name" width="20" height="20" />
                        {{ alt.name }} - {{ alt.shortDescription }}
                        <Categories :categories="alt.categories" />
                        <br>
                        Pricing: {{ alt.tags.pricing }}, Licensing: {{ alt.tags.licensing }}
                        <br>
                        Rating: {{ alt.rating.stars }} stars ({{ alt.rating.reviews }} reviews)
                        <br>
                        <p>Pros:</p>
                        <ul>
                            <li v-for="(pro, index) in alt.pros" :key="index">
                                {{ pro.name }} ({{ pro.votes }} votes)
                            </li>
                        </ul>
                        <p>Cons:</p>
                        <ul>
                            <li v-for="(con, index) in alt.cons" :key="index">
                                {{ con.name }} ({{ con.votes }} votes)
                            </li>
                        </ul>
                    </NuxtLink>
                </div>
                <NuxtLink :to="`${data.name}/alternatives`" class="view-alternatives-btn">
                    <p>View All</p>
                </NuxtLink>
            </section>
        </main>
        <!-- Loading state -->
        <div v-else>
            <p>Loading...</p>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
// Hydration mismatch prevention
const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
})

// Setup the route and data fetching
const route = useRoute()
const { name } = route.params

const { data, error, retryFetch: retryToolData } = useFetchToolData(name as string)
const { alternatives, retryFetch: retryAlternatives } = useFetchAlternatives(data || {})
const { reviews, retryFetch: retryReviews } = useFetchReviews(data || {})

const retryFetch = () => {
    retryToolData()
    retryAlternatives()
    retryReviews()
}

const onScroll = (event: WheelEvent): void => {
    const target = event.currentTarget as HTMLElement;
    target.scrollLeft += event.deltaY;
}

const getLabelForRating = (rating: number) => {
    const labels: { [key: number]: string } = {
        5: 'Excellent',
        4: 'Very good',
        3: 'Average',
        2: 'Poor',
        1: 'Terrible'
    }
    return labels[rating] || 'Unknown'
}

const calculateBarWidth = (rating: number, totalReviews: number) => {
    const percentage = (rating / totalReviews) * 100
    return `${percentage}%`
}

type Opinion = {
    name: string
    votes: string
}
const sortAndLimitItems = (items: Opinion[]) => {
    return items
        .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
        .slice(0, 4);
}
</script>


<style scoped lang="scss">
main {
    display: flex;
    flex-direction: column;

    gap: $xxl;
    padding: 0 $xxl;

    .general {
        display: flex;
        flex-direction: row;

        width: 100%;

        gap: $xl;

        .info {
            display: flex;
            flex-direction: column;

            flex-grow: 1;

            gap: $m;

            .description {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;

                flex-grow: 1;
                width: 100%;

                gap: $s;
                padding: $xl;

                border: 1px solid $primary-200;
                border-radius: $m;
            }

            .info-cards {
                display: flex;
                flex-direction: row;

                width: 100%;

                gap: $m;

                .rankings,
                .pricing,
                .licensing {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;

                    min-width: 12.5rem;
                    height: 12.5rem;

                    padding: $xl;

                    border: 1px solid $primary-200;
                    border-radius: $m;
                }

                .pricing {
                    user-select: none;
                    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

                    h4 {
                        display: flex;
                        justify-content: space-between;

                        width: 100%;

                        span {
                            transform: rotateY(180deg);
                        }
                    }

                    .tag--static--pricing {
                        cursor: pointer;
                    }

                    &:hover {
                        box-shadow: $shadow-300;
                        transform: translateY(-0.3rem);
                    }
                }

                .categories {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;

                    flex-grow: 1;

                    padding: $xl;

                    border: 1px solid $primary-200;
                    border-radius: $m;

                    .wrapper {
                        display: flex;
                        flex-wrap: wrap;

                        gap: $s;
                    }
                }
            }
        }

        .banner {
            display: flex;
            overflow: hidden;
            height: 23.125rem;
            min-width: 41.1rem;

            border: 1px solid $primary-200;
            border-radius: $m;

            iframe {
                width: 100%;
                height: 100%;
            }
        }
    }

    .resources {
        display: flex;
        flex-direction: column;

        width: 100%;

        gap: $m;

        .resources-wrapper {
            display: grid;
            grid-template-columns: repeat(5, minmax(20rem, 1fr));
            width: 100%;

            gap: $m;
        }

        .view-resources-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;

            width: 100%;

            padding: $m;

            border: 1px solid $primary-200;
            border-radius: $m;

            cursor: pointer;
            transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

            &:hover {
                box-shadow: $shadow-300;
                transform: translateY(-0.3rem);
            }
        }
    }

    .user-sentiment {
        display: flex;
        flex-direction: column;

        width: 100%;

        gap: $m;

        .user-sentiment-wrapper {
            display: flex;
            flex-direction: row;
            box-sizing: border-box;

            width: 100%;

            gap: $xxl;

            .sentiment {
                display: flex;
                flex-direction: column;

                gap: $m;

                .rating {
                    display: flex;
                    flex-direction: row;

                    gap: $m;

                    .stats {
                        display: flex;
                        flex-direction: column-reverse;

                        flex-grow: 1;

                        padding: $xl;
                        gap: $s;

                        border: 1px solid $primary-200;
                        border-radius: $m;

                        .rating-row {
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            gap: $m;

                            .label {
                                width: 5.5rem;
                            }

                            .bar-background {
                                display: flex;
                                justify-content: flex-start;
                                align-items: flex-start;

                                height: 0.5rem;
                                flex-grow: 1;

                                background-color: $primary-100;

                                border-radius: 1rem;

                                .bar {
                                    height: 100%;

                                    background-color: $secondary-400;

                                    border-radius: 1rem;
                                }
                            }

                            .count {
                                width: 2.5rem;
                            }
                        }
                    }

                    .stars {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        padding: $xl;
                        gap: $xs;

                        aspect-ratio: 1 / 1;

                        border: 1px solid $primary-200;
                        border-radius: $m;

                        user-select: none;

                        h1 {
                            height: 5.3rem;
                        }

                        .star-container {
                            position: relative;
                            display: inline-flex;

                            width: 8rem;

                            user-select: none;

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

                .pros-and-cons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;

                    width: 100%;

                    gap: $m;

                    .pros,
                    .cons {
                        display: flex;
                        flex-direction: column;

                        padding: $xl;
                        gap: $s;

                        border: 1px solid $primary-200;
                        border-radius: $m;

                        .pros-header,
                        .cons-header {
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            gap: $s;

                            .material-symbols-rounded {
                                user-select: none;
                            }
                        }

                        .opinion-row {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;

                            gap: $m;

                            .votes-wrapper {
                                display: flex;
                                flex-direction: row;
                                align-items: center;

                                gap: $xs;

                                user-select: none;

                                .upvote {
                                    color: $primary-200;
                                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                                    transition: color 0.2s ease-out;
                                    cursor: pointer;

                                    &:hover {
                                        color: $secondary-400;
                                        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                                    }
                                }

                                .downvote {
                                    color: $primary-200;
                                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                                    transition: color 0.2s ease-out;
                                    cursor: pointer;
                                    transform: rotateX(180deg);

                                    &:hover {
                                        color: $primary-400;
                                        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' -25, 'opsz' 24;
                                    }
                                }
                            }
                        }
                    }

                    .contribute-btn {
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;

                        grid-column: span 2;

                        padding: $m;

                        border: 1px solid $primary-200;
                        border-radius: $m;

                        cursor: pointer;
                        transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

                        &:hover {
                            box-shadow: $shadow-300;
                            transform: translateY(-0.3rem);
                        }
                    }
                }
            }

            .reviews {
                display: flex;
                flex-direction: column;

                flex-grow: 1;

                gap: $m;

                .review-cta {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;

                    width: 100%;

                    padding: $xl;

                    border: 1px solid $primary-200;
                    border-radius: $m;
                }

                .review-wrapper {
                    display: flex;
                    flex-direction: row;

                    width: 100%;
                    flex-grow: 1;

                    gap: $m;

                    .review {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        flex-grow: 1;

                        padding: $xl;

                        border: 1px solid $primary-200;
                        border-radius: $m;

                        cursor: pointer;
                        transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

                        .review-content-wrapper {
                            display: flex;
                            flex-direction: column;

                            gap: $xs;

                            .comment-header {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: flex-start;

                                gap: $s;
                                padding-bottom: $s;

                                .user-info {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;

                                    gap: $m;

                                    .user-pfp {
                                        width: 3rem;
                                        height: 3rem;

                                        border-radius: 50%;
                                    }

                                    .user-details {
                                        display: flex;
                                        flex-direction: column;

                                        .p3 {
                                            color: $primary-300;
                                        }
                                    }
                                }

                                .report-btn {
                                    color: $primary-400;
                                    cursor: pointer;
                                    user-select: none;

                                    font-size: 2rem;
                                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
                                }
                            }

                            .star-rating {
                                display: inline-flex;

                                gap: 0.2rem;

                                user-select: none;

                                .material-symbols-rounded {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;

                                    width: 1.1rem;
                                    height: 1.1rem;

                                    font-size: 1.6rem;
                                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;

                                    user-select: none;

                                    &.filled {
                                        color: $secondary-400;
                                    }

                                    &.empty {
                                        color: $primary-100;
                                    }
                                }
                            }
                        }

                        .date {
                            color: $gray-50;
                        }

                        &:hover {
                            box-shadow: $shadow-300;
                            transform: translateY(-0.3rem);
                        }
                    }
                }

                .view-reviews-btn {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;

                    padding: $m;

                    border: 1px solid $primary-200;
                    border-radius: $m;

                    cursor: pointer;
                    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

                    &:hover {
                        box-shadow: $shadow-300;
                        transform: translateY(-0.3rem);
                    }
                }
            }
        }
    }

    .alternatives {
        display: flex;
        flex-direction: column;
        gap: $m;

        .content {
            display: grid;
            grid-template-columns: repeat(4, minmax(20rem, 1fr));
            gap: $m;

            .alternative {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;

                padding: $xl;

                border: 1px solid $primary-200;
                border-radius: $m;

                transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

                &:not(#current-tool) {
                    &:hover {
                        box-shadow: $shadow-300;
                        transform: translateY(-0.3rem);
                    }
                }
            }
        }

        .view-alternatives-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;

            padding: $m;

            border: 1px solid $primary-200;
            border-radius: $m;

            cursor: pointer;
            transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

            &:hover {
                box-shadow: $shadow-300;
                transform: translateY(-0.3rem);
            }
        }
    }
}
</style>