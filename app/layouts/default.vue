<template>
    <!-- Vercel speed insights <SpeedInsights />-->
    <div class="layout">
        <header class="layout__header">
            <nav class="layout__nav">
                <NuxtLink class="nav__logo" to="/">
                    <span class="material-symbols-rounded">category_search</span>
                </NuxtLink>
                <ul class="nav__list">
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/explore">
                            <p>Explore</p>
                        </NuxtLink>
                    </li>
                    <!-- <li class="item nav__item">  
                        <NuxtLink class="link item__link" to="/quiz">
                            <p>Quiz</p>
                        </NuxtLink>
                    </li> -->
                    <li class="item nav__item">
                        <NuxtLink class="link item__link" to="/wiki">
                            <p>Wiki</p>
                        </NuxtLink>
                    </li>
                </ul>
                <div class="nav__btns btns">
                    <!-- <button class="btn btn--secondary--small">
                        <NuxtLink class="link" to="/wiki/contribute">Add a Tool</NuxtLink>
                    </button> -->
                    <NuxtLink v-if="data" class="btn btn--primary--small" :to="`/user/@${data.user?.name}`" external>
                        View Profile
                    </NuxtLink>
                    <button v-else class="btn btn--primary--small" @click="openModal">Sign In</button>
                </div>
                <Modal :is-open="isModalOpen" @close="closeModal">
                    <SignIn />
                </Modal>
            </nav>
        </header>

        <main class="layout__main">
            <slot />
        </main>

        <footer v-if="$route.path !== '/'" class="layout__footer">
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
                    <NuxtLink to="https://instagram.com" class="footer__icon">
                        <span class="material-symbols-rounded">domino_mask</span>
                    </NuxtLink>
                    <NuxtLink to="https://twitter.com" class="footer__icon">
                        <span class="material-symbols-rounded">flutter</span>
                    </NuxtLink>
                    <NuxtLink to="https://facebook.com" class="footer__icon">
                        <span class="material-symbols-rounded">diamond</span>
                    </NuxtLink>
                </div>
            </div>
        </footer>
        <button v-if="name !== 'index'" @click="scrollToTop" class="scroll-top-button" :class="showButton()">
            <span class="material-symbols-rounded">keyboard_arrow_up</span>
        </button>
    </div>
</template>

<script setup lang="ts">
// Vercel speed insights      import { SpeedInsights } from "@vercel/speed-insights";
const { name } = useRoute()
const { data } = useAuth();

const showScrollTopButton = ref<'true' | 'false' | 'bottom'>('false')

const checkScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
        showScrollTopButton.value = 'bottom'
    } else {
        showScrollTopButton.value = window.scrollY > 300 ? 'true' : 'false'
    }
}

const showButton = () => {
    switch (showScrollTopButton.value) {
        case 'true':
            return "visible"
        case 'bottom':
            return "bottom"
        case 'false':
            return "hidden"
    }
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
})

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
.layout__header {
    z-index: 999;

    .layout__nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: $xl;
        padding: $xxl;
        border-bottom: 1px solid $primary-100;

        .nav__logo {
            display: flex;
            align-items: center;
            gap: $m;

            span {
                color: $primary-400;
                font-size: 2rem;
                font-variation-settings: 'opsz' 32, 'wght' 500, 'FILL' 0, 'GRAD' 100;
            }
        }
    }
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
    margin-bottom: 5rem;
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

                span {
                    font-size: 1.5rem;
                    font-variation-settings: 'opsz' 20, 'wght' 300, 'FILL' 0, 'GRAD' 100;
                }
            }
        }
    }
}

.scroll-top-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: $xxl;
    right: $xxl;

    background-color: $primary-400;
    box-shadow: $shadow-500;

    border: none;
    border-radius: 5rem;

    width: 3.5rem;
    height: 3.5rem;

    color: white;
    cursor: pointer;

    transition: transform 0.3s ease-out, visibility 0.3s ease-out, width 0.3s ease-out, border-radius 0.3s ease-out, box-shadow 0.3s ease-out;
    z-index: 999;

    .material-symbols-rounded {
        transition: transform 0.3s ease-out;
        font-size: 2rem;
    }

    &:hover {
        .material-symbols-rounded {
            animation: jumpAndWiggle 0.5s ease;
        }
    }

    @keyframes jumpAndWiggle {
        0% {
            transform: translateY(0) rotate(0deg);
        }

        25% {
            transform: translateY(-5px) rotate(-5deg);
        }

        50% {
            transform: translateY(-7px) rotate(5deg);
        }

        75% {
            transform: translateY(-5px) rotate(-5deg);
        }

        100% {
            transform: translateY(0) rotate(0deg);
        }
    }

    &::after {
        content: 'Back to top';
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;

        top: 0;
        left: 2rem;
        bottom: 0;

        color: white;
        font-size: 1rem;
        font-weight: 500;
        text-wrap: nowrap;

        opacity: 0;
        scale: 0;
        transition: opacity 0.2s ease-out, scale 0.2s ease-out;
    }
}

.hidden {
    visibility: hidden;
    transform: translateY(6rem) scale(0.5);
}

.visible {
    visibility: visible;
    transform: translateY(0) scale(1);
}

.bottom {
    visibility: visible;

    width: 11rem;
    border-radius: 5rem;

    box-shadow: none;

    .material-symbols-rounded {
        transform: translateX(3.7rem);
    }

    &:hover {
        .material-symbols-rounded {
            animation: jumpAndWiggleBottom 0.5s ease;
        }
    }

    @keyframes jumpAndWiggleBottom {
        0% {
            transform: translateX(3.7rem) translateY(0) rotate(0deg);
        }

        25% {
            transform: translateX(3.7rem) translateY(-5px) rotate(-5deg);
        }

        50% {
            transform: translateX(3.7rem) translateY(-7px) rotate(5deg);
        }

        75% {
            transform: translateX(3.7rem) translateY(-5px) rotate(-5deg);
        }

        100% {
            transform: translateX(3.7rem) translateY(0) rotate(0deg);
        }
    }

    &::after {
        opacity: 1;
        scale: 1;
        transition: opacity 0.2s ease-out 0.1s, scale 0.2s ease-out 0.1s;
    }
}
</style>