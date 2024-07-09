<template>
    <div>
        <h2>Profile of {{ username }}</h2>
    </div>
</template>

<script>
const { username } = useRoute().params
</script>

<style lang="scss" scoped></style>