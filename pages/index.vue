<script setup lang="ts">
// import { connectDB, client } from '~/server/utils/db.js';

//connectDB();

//const movie = await client.db("sample_mflix").collection("movies").findOne({ title: "The Great Train Robbery" });
</script>

<template>
  <div>
    <h1>The catalogue of web-development tools.</h1>
    <NuxtLink to="/explore">Explore the catalogue</NuxtLink>
    <p>Unsure what to use? Use our state-of-the-art system to find the best tools for your project.</p>
    <NuxtLink to="/form">Find the best tools for my project</NuxtLink>
  </div>
</template>
