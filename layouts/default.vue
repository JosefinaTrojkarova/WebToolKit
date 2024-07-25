<template>
    <!-- Vercel speed insights <SpeedInsights />-->
    <div class="layout">
        <header class="layout__header">
            <nav class="layout__nav">
                <NuxtLink class="nav__logo" to="/">WebToolKit</NuxtLink>
                <ul class="nav__list">
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/explore">Explore</NuxtLink>
                    </li>
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/quiz">Quiz</NuxtLink>
                    </li >
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/wiki">Wiki</NuxtLink>
                    </li>
                </ul>
                <div class="nav__btns btns">
                    <button class="btn btn--primary">
                        <NuxtLink to="/wiki/contribute">Add a Tool</NuxtLink>
                    </button>
                    <button class="btn btn--secondary" @click="openModal">Log In</button>
                </div>
                <Modal :is-open="isModalOpen" @close="closeModal">
                    <LoginForm />
                </Modal>
            </nav>
        </header>

        <main>
            <slot />
        </main>

        <footer class="layout__footer">
            <div class="footer__links">
                <div class="links">
                    <p class="links__title">Use cases</p>
                    <ul class="links__list list">
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">UI design</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">UX design</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Wireframing</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="links">
                    <p class="links__title">Explore</p>
                    <ul class="links__list list">
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Design</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Prototyping</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Development features</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="links">
                    <p class="links__title">User</p>
                    <ul class="links__list list">
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Public profile</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Account settings</NuxtLink>
                        </li>
                        <li class="item footer__item">
                            <NuxtLink class="link item__link" to="/">Colors</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
            <p class="footer__text--blue">2024 &copy; WebToolKit s.r.o.</p>
            <p class="footer__text--gray">Made by web-devs for web-devs.</p>
            <div class="footer__icons">
                <i class="footer__icon">ikona</i>
                <i class="footer__icon">ikona</i>
                <i class="footer__icon">ikona</i>
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