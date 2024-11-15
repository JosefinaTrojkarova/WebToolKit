<template>
    <div>
        <h1>{{ data?.user?.name }}</h1>
        <div v-if="data">
            <p>Welcome, {{ data?.user?.name }}!</p>
            <img v-if="data?.user?.image" :src="data.user.image" alt="Profile picture" class="profile-image" />
            <p>Email: {{ data?.user?.email }}</p>
            <h2>Profile Functions:</h2>
            <button class="signOut" @click="signOut({ callbackUrl: '/' })">Sign
                Out</button>
            <br>
            <button class="deleteAcc" @click="handleDeleteAccount">
                Delete Account
            </button>
        </div>
        <div v-else>
            <p>You are not logged in.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { data, signOut } = useAuth()
const { deleteAccount } = useAccount()

const handleDeleteAccount = async () => {
    if (!data.value?.user?.email) return

    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            await deleteAccount(data.value.user.email)
            await signOut({ callbackUrl: '/' })
        } catch (e) {
            console.error('Failed to delete account:', e)
        }
    }
}
</script>

<style scoped>
button {
    padding: 20px;
    margin: 10px;
    font-size: 20px;
    font-weight: 800;
    background-color: rgb(255, 101, 101);
    cursor: pointer;
}
</style>
