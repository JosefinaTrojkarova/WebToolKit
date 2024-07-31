<template>
    <div>
        <h1>{{ name }}</h1>
        <div v-if="status === 'pending'">Loading...</div>
        <div v-else-if="error">
            <p>Error: {{ error.message }}</p>
            <button @click="retryFetch">Retry</button>
        </div>
        <div v-else-if="data">
            <p><strong>ID:</strong> {{ data._id }}</p>
            <p><strong>Name:</strong> {{ data.name }}</p>
            <p><strong>Short Description:</strong> {{ data.shortDescription }}</p>
            <p><strong>Description:</strong> {{ data.description }}</p>
            <p><strong>Video:</strong> <a :href="data.video">{{ data.video }}</a></p>
            <p><strong>Logo:</strong> <img :src="data.logo" alt="Logo" /></p>
            <p><strong>Categories:</strong> {{ data.categories.join(', ') }}</p>
            <p><strong>Pricing:</strong> {{ data.tags.pricing }}</p>
            <p><strong>Licensing:</strong> {{ data.tags.licensing }}</p>
            <ul>
                <li><strong>Stars:</strong> {{ data.rating.stars }}</li>
                <li><strong>Reviews:</strong> {{ data.rating.reviews }}</li>
                <li><strong>Saves:</strong> {{ data.rating.saves }}</li>
            </ul>
            <p><strong>Resources:</strong></p>
            <ul>
                <li v-for="(resource, index) in data.resources" :key="index">
                    <a :href="resource">{{ resource }}</a>
                </li>
            </ul>
            <p><strong>Pros:</strong></p>
            <ul>
                <li v-for="(pro, index) in data.pros" :key="index">{{ pro }}</li>
            </ul>
            <p><strong>Cons:</strong></p>
            <ul>
                <li v-for="(con, index) in data.cons" :key="index">{{ con }}</li>
            </ul>
            <p><strong>Alternatives:</strong></p>
            <ul>
                <li v-for="(alternative, index) in data.alternatives" :key="index">{{ alternative }}</li>
            </ul>
        </div>
        <NuxtLink v-if="data" :to="`/tool/${name}/edit`">Edit</NuxtLink>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { name } = route.params

const { data, error, status, refresh } = useLazyFetch<Tool>(`/api/tool/${name}`, {
    key: `tool-${name}`,
})

const retryFetch = () => {
    refresh()
}
</script>


<style scoped></style>