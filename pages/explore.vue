<template>
    <div>
        <header>
            <input type="text" placeholder="Search for tools" />
        </header>
        <main>
            <!-- Display a list of tools -->

            <!-- Placeholder -->
            <NuxtLink to="/tool/tailwindcss" class="card">
                <h2>Tailwind CSS</h2>
                <p>Tool Description</p>
            </NuxtLink>
        </main>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* Temporary style */
.card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    margin: 1rem;
    text-decoration: none;
    color: inherit;
    display: block;
}
</style>