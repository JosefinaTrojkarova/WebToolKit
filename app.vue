<script setup lang="ts">
import { connectDB, client } from '~/utils/db.js';

connectDB();

const movie = await client.db("sample_mflix").collection("movies").findOne({ title: "The Great Train Robbery" });
await client.close();
</script>

<template>
  <div>
    <h1 v-if="movie">{{ movie.fullplot }}</h1>
  </div>
</template>
