<template>
    <NuxtLayout name="tool">
        <!-- Error state -->
        <div v-if="error">
            <p>Error: {{ error.message }}</p>
            <button @click="retryFetch">Retry</button>
        </div>
        <!-- Working state -->
        <div v-else-if="isMounted && data">
            <p><strong>ID:</strong> {{ data._id.$oid }}</p>
            <p><strong>Name:</strong> {{ data.name }}</p>
            <p><strong>Short Description:</strong> {{ data.shortDescription }}</p>
            <p><strong>Description:</strong> {{ data.description }}</p>
            <p><strong>Video:</strong> <a :href="data.video">{{ data.video }}</a></p>
            <p><strong>Logo:</strong> <img :src="data.logo" alt="Logo" /></p>
            <p><strong>Categories:</strong> {{ data.categories ? data.categories.join(', ') : 'No categories available'
                }}</p>
            <p><strong>Pricing:</strong> {{ data.tags?.pricing || 'Not available' }}</p>
            <p><strong>Licensing:</strong> {{ data.tags?.licensing || 'Not available' }}</p>
            <h3>Rating:</h3>
            <ul>
                <li v-for="star in [1, 2, 3, 4, 5]" :key="star">
                    <strong>{{ star }} Star:</strong> {{ data.rating ? data.rating[star] : 'No data' }}
                </li>
                <li><strong>Average Stars:</strong> {{ data.rating ? data.rating.stars : 'No data' }}</li>
                <li><strong>Reviews:</strong> {{ data.rating ? data.rating.reviews : 'No data' }}</li>
                <li><strong>Saves:</strong> {{ data.rating ? data.rating.saves : 'No data' }}</li>
            </ul>
            <p><strong>Resources:</strong></p>
            <ul>
                <li v-for="(resource, index) in data.resources" :key="index">
                    <a :href="resource.link">{{ resource.type }}: {{ resource.link }}</a>
                </li>
            </ul>
            <p><strong>Pros:</strong></p>
            <ul>
                <li v-for="(pro, index) in data.pros" :key="index">
                    {{ pro.name }} ({{ pro.votes }} votes)
                </li>
            </ul>
            <p><strong>Cons:</strong></p>
            <ul>
                <li v-for="(con, index) in data.cons" :key="index">
                    {{ con.name }} ({{ con.votes }} votes)
                </li>
            </ul>
            <div v-if="reviews.length > 0">
                <p><strong>Reviews:</strong></p>
                <ul>
                    <li v-for="review in reviews" :key="review._id">
                        <p><strong>{{ review.user }}</strong> - {{ new Date(review.date).toLocaleDateString() }}</p>
                        <p>Rating: {{ review.rating }}/5</p>
                        <p>{{ review.comment }}</p>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>No reviews yet.</p>
            </div>
            <p><strong>Alternatives:</strong></p>
            <ul>
                <li v-for="alt in alternatives" :key="alt._id">
                    <img :src="alt.logo" :alt="alt.name" width="20" height="20" />
                    {{ alt.name }} - {{ alt.shortDescription }}
                    (Categories: {{ alt.categories.join(', ') }})
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
            <NuxtLink :to="`/tool/${name}/edit`">Edit</NuxtLink>
        </div>
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


<style scoped></style>