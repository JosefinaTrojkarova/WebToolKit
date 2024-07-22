<template>
    <!-- Vercel speed insights <SpeedInsights />-->
    <div>
        <header>
            <nav>
                <NuxtLink to="/" class="logo">WebToolKit</NuxtLink>
                <ul>
                    <li>
                        <NuxtLink to="/explore">Explore</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/quiz">Quiz</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/wiki">Wiki</NuxtLink>
                    </li>
                </ul>
                <div>
                    <button><NuxtLink to="/wiki/contribute">Add a Tool</NuxtLink></button>
                    <button @click="openModal">Log In</button>
                </div>
                <Modal :is-open="isModalOpen" @close="closeModal">
                    <LoginForm />
                </Modal>
            </nav>
        </header>

        <main>
            <slot />
        </main>

        <footer>
            <!-- Add your footer content here -->
            <p>2024 &copy; WebToolKit s.r.o.</p>
            <p>Made by web-devs for web-devs.</p>
            <div>
                <i>ikona</i>
                <i>ikona</i>
                <i>ikona</i>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
// Vercel speed insights      import { SpeedInsights } from "@vercel/speed-insights";


const { isModalOpen, openModal, closeModal } = useModal()
</script>

<style lang="scss" scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/*header {}

nav {}

main {
    flex: 1;
}

footer {}*/
</style>