<template>
    <div>
        <h1>{{ name }}</h1>
        <div v-if="error">
            <p>Error: {{ error.message }}</p>
            <button @click="retryFetch">Retry</button>
        </div>
        <div v-else-if="data">
            <p><strong>ID:</strong> {{ data._id.$oid }}</p>
            <p><strong>Name:</strong> {{ data.name }}</p>
            <p><strong>Short Description:</strong> {{ data.shortDescription }}</p>
            <p><strong>Description:</strong> {{ data.description }}</p>
            <p><strong>Video:</strong> <a :href="data.video">{{ data.video }}</a></p>
            <p><strong>Logo:</strong> <img :src="data.logo" alt="Logo" /></p>
            <p><strong>Categories:</strong> {{ data.categories.join(', ') }}</p>
            <p><strong>Pricing:</strong> {{ data.tags.pricing }}</p>
            <p><strong>Licensing:</strong> {{ data.tags.licensing }}</p>
            <h3>Rating:</h3>
            <ul>
                <li><strong>1 Star:</strong> {{ data.rating[1] }}</li>
                <li><strong>2 Stars:</strong> {{ data.rating[2] }}</li>
                <li><strong>3 Stars:</strong> {{ data.rating[3] }}</li>
                <li><strong>4 Stars:</strong> {{ data.rating[4] }}</li>
                <li><strong>5 Stars:</strong> {{ data.rating[5] }}</li>
                <li><strong>Average Stars:</strong> {{ data.rating.stars }}</li>
                <li><strong>Reviews:</strong> {{ data.rating.reviews }}</li>
                <li><strong>Saves:</strong> {{ data.rating.saves }}</li>
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
        </div>
        <NuxtLink v-if="data" :to="`/tool/${name}/edit`">Edit</NuxtLink>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { name } = route.params

const { data, error, alternatives, reviews, retryFetch } = useTool(name as string)
</script>


<style scoped></style>