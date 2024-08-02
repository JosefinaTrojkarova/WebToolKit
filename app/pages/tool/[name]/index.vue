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
                        <div class="pricing">
                            <h4>Pricing <span class="material-symbols-rounded">captive_portal</span></h4>
                            <button class="tag--static--pricing">
                                <span class="material-symbols-rounded">attach_money</span>
                                <p>{{ data.tags?.pricing || 'Not available' }}</p>
                            </button>
                        </div>
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
                <ul>
                    <ResourceCard v-for="(resource, index) in data.resources" :key="index" :link="resource.link"
                        :type="resource.type">
                    </ResourceCard>
                </ul>
                <button>
                    <p>View All</p>
                </button>
            </section>
            <section class="user-sentiment">
                <h3>User Sentiment</h3>
                <div class="sentiment">
                    <div class="rating">
                        <div class="stats"></div>
                        <div class="stars"></div>
                    </div>
                    <div class="pros-and-cons">
                        <div class="pros"></div>
                        <div class="cons"></div>
                        <button>Contribute</button>
                    </div>
                </div>
                <div class="reviews">
                    <ul>
                        <li v-for="review in reviews" :key="review._id">
                            <p><strong>{{ review.user }}</strong> - {{ new Date(review.date).toLocaleDateString() }}</p>
                            <p>Rating: {{ review.rating }}/5</p>
                            <p>{{ review.comment }}</p>
                        </li>
                    </ul>
                    <button>View All</button>
                </div>
            </section>
            <section class="alternatives">
                <h3>Popular Alternatives</h3>
                <ul>
                    <li class="current-tool">
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
                    </li>
                    <li v-for="alt in alternatives" :key="alt._id">
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
                    </li>
                </ul>
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

const route = useRoute()
const { name } = route.params

const { data, error, retryFetch: retryToolData } = useFetchToolData(name as string);
const { alternatives, retryFetch: retryAlternatives } = useFetchAlternatives(data || {})
const { reviews, retryFetch: retryReviews } = useFetchReviews(data || {})

const retryFetch = () => {
    retryToolData()
    retryAlternatives()
    retryReviews()
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

                    h4 {
                        display: flex;
                        justify-content: space-between;

                        width: 100%;

                        span {
                            transform: rotateY(180deg);
                        }
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

        ul {
            display: flex;
            flex-direction: row;
        }

        button {
            display: inline-flex;
            justify-content: center;
            align-items: center;

            width: 100%;

            padding: $m;

            border: 1px solid $primary-200;
            border-radius: $m;
        }
    }
}
</style>