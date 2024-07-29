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
                    </li>
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/wiki">Wiki</NuxtLink>
                    </li>
                </ul>
                <div class="nav__btns btns">
                    <button class="btn btn--secondary--small">
                        <NuxtLink class="link" to="/wiki/contribute">Add a Tool</NuxtLink>
                    </button>
                    <button class="btn btn--primary--small" @click="openModal">Sign In</button>
                </div>
                <Modal :is-open="isModalOpen" @close="closeModal">
                    <LoginForm />
                </Modal>
            </nav>
        </header>

        <main class="layout__main">
            <slot />
        </main>

        <footer class="layout__footer">
            <div class="footer__links">
                <div class="links">
                    <p class="links__title b1">Use cases</p>
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
                    <p class="links__title b1">Explore</p>
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
                    <p class="links__title b1">User</p>
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
            <div class="footer__info">
                <p class="footer__text b1">2024 &copy; WebToolKit s.r.o.</p>
                <p class="footer__text--gray">Made by web-devs for web-devs.</p>
                <div class="footer__icons">
                    <i class="footer__icon">ikona</i>
                    <i class="footer__icon">ikona</i>
                    <i class="footer__icon">ikona</i>
                </div>
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

.layout__main {
    flex: 1 0 auto; // pushing footer to the bottom
}

.nav__item {
    padding: 8px;
}

// Navbar
.layout__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $xl;
    padding: $xxl;
    border-bottom: 1px solid $primary-100;
}

.nav__list {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: $s;
}

.nav__btns {
    display: flex;
    gap: $m;
}


// Footer
.layout__footer {
    display: flex;
    justify-content: space-between;
    padding: $xxl;
    margin-top: $xxl;
    margin-bottom: 50px;
    border-top: 1px solid $primary-100;

    // Left
    .footer__links {
        display: flex;

        .links {
            width: 260px; // ???

            .links__title {
                height: 40px; // ???
            }

            .links__list {
                display: flex;
                flex-direction: column;
                gap: $m;
            }
        }
    }

    // Right
    .footer__info {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: $xxl;

        .footer__text--gray {
            color: $gray-200;
        }

        .footer__icons {
            display: flex;
            gap: $l;

            .footer__icon {
                display: flex;
                justify-content: center;
                align-items: center;

                color: white;

                height: 45px;
                width: 45px;
                border-radius: 50%;
                background-color: $primary-400;
            }
        }
    }
}
</style>