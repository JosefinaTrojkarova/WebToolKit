<template>
    <div>
        <h2>Profile of {{ username }}</h2>
    </div>
</template>

<script>
export default {
    computed: {
        username() {
            return this.$route.params.username;
        }
    }
};
</script>

<style lang="scss" scoped></style>