<template>
    <!-- Vercel speed insights -->
    <SpeedInsights />
    <!--------------------------->
    <div>
        <nav>
            <NuxtLink to="/">WebToolKit</NuxtLink>
            <ul>
                <li>
                    <NuxtLink to="/wiki">Wiki</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/wiki/contribute">Contribute</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard">Dashboard</NuxtLink>
                </li>
                <li>
                    <button @click="openModal">Log In</button>
                </li>
            </ul>
            <Modal :is-open="isModalOpen" @close="closeModal">
                <LoginForm />
            </Modal>
        </nav>
    </div>
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
// Vercel speed insights
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
// ---------------------

const { isModalOpen, openModal, closeModal } = useModal()
</script>

<style lang="scss" scoped></style>