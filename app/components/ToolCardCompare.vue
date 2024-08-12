<template>
  <NuxtLink class="alternative" :to="`/tool/${item.name.toLowerCase()}`">
    <img :src="item.logo" :alt="item.name" width="20" height="20" />
    {{ item.name }} - {{ item.shortDescription }}
    <Categories :categories="item.categories" />
    <br>
    Pricing: {{ item.tags.pricing }}, Licensing: {{ item.tags.licensing }}
    <br>
    Rating: {{ item.rating.stars }} stars ({{ item.rating.reviews }} reviews)
    <br>
    <p>Pros:</p>
    <ul>
      <li v-for="(pro, index) in item.pros" :key="index">
        {{ pro.name }} ({{ pro.votes }} votes)
      </li>
    </ul>
    <p>Cons:</p>
    <ul>
      <li v-for="(con, index) in item.cons" :key="index">
        {{ con.name }} ({{ con.votes }} votes)
      </li>
    </ul>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: Alternative
}>()
</script>

<style scoped lang="scss">
p {
  color: salmon;
}
</style>