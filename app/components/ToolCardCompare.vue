<!-- <template>
  <NuxtLink class="main" :to="`/tool/${data.name.toLowerCase()}`">
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
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { alternatives, retryFetch: retryAlternatives } = useFetchAlternatives(data || {})
</script>

<style>

</style> -->