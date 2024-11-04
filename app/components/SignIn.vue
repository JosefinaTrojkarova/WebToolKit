<template>
    <div class="sign">
        <!-- <NuxtLink class="sign__logo" to="/">WebToolKit</NuxtLink> -->
        <h2 class="sign__title">Sign In</h2>
        <div class="sign__options">
            <button class="option option--google" @click="signInWithProvider('google')">
                <span class="search-icon material-symbols-rounded">search</span>
                Continue with Google
            </button>

            <!-- <div class="options__social">
                <button class="option option--apple" @click="signInWithProvider('apple')">
                    <span class="search-icon material-symbols-rounded">search</span>
                </button>
                <button class="option option--facebook" @click="signInWithProvider('facebook')">
                    <span class="search-icon material-symbols-rounded">search</span>
                </button>
                <button class="option option--github" @click="signInWithProvider('github')">
                    <span class="search-icon material-symbols-rounded">search</span>
                </button>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
const signInWithProvider = (provider: string) => {
    // Handle social login here
    // For example, use $auth.loginWith(provider) 
    console.log(`Sign in with ${provider}`)
}
</script>

<style lang="scss">
// scoped???
.sign {
    display: flex;
    flex-direction: column;

    gap: $m;
    width: 21.5rem;

    background-color: $system-bg;
}

.sign__options {
    display: flex;
    flex-direction: column;

    gap: $s;
}

.option {
    height: 3rem;
    width: 100%;

    border: 1px solid $primary-200;

    cursor: pointer;
}

.option--google {
    display: flex;
    align-items: center;

    gap: $m;
    padding-left: $m;

    background-color: $system-white;
    color: $gray-300;

    font-size: 1.125rem;
    font-weight: 500;
    border-radius: $m;
}

.options__social {
    display: flex;
    justify-content: space-between;

    gap: $s;

    .option {
        border-radius: $s;
        color: $system-white;
    }

    .option--apple {
        background-color: #000000;
    }

    .option--facebook {
        background-color: #1877f2;

    }

    .option--github {
        background-color: #1b1f23;
    }
}
</style>