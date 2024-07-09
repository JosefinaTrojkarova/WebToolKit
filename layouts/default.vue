<template>
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
import { useModal } from '~/composables/useModal'

const { isModalOpen, openModal, closeModal } = useModal()
</script>

<style lang="scss" scoped></style>