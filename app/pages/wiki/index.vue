<template>
    <main class="wiki">
        <section class="wiki-header">
            <h1>The WebToolKit Wiki</h1>
            <p>Welcome to our comprehensive guide about WebToolKit - your go-to platform for discovering web development
                tools</p>
        </section>

        <div class="wiki-sections">
            <!-- About Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('about')" :class="{ 'active': openSections.about }">
                    <h2>What is WebToolKit</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.about">
                    <p>WebToolKit is a community-driven catalogue of web development tools made by web-devs for
                        web-devs. Our platform helps you:</p>
                    <ul>
                        <li>Discover new development tools</li>
                        <li>Read community reviews</li>
                        <li>Find alternatives to your current tools</li>
                    </ul>
                </div>
            </section>

            <!-- Features Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('features')"
                    :class="{ 'active': openSections.features }">
                    <h2>Key Features</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.features">
                    <div class="feature">
                        <h3>Tool Catalog</h3>
                        <p>Browse through our extensive collection of development tools, complete with descriptions,
                            ratings, user reviews and many more interesting informations.</p>
                    </div>
                    <div class="feature">
                        <h3>Community Reviews</h3>
                        <p>Read authentic reviews from fellow developers and share your own experiences.</p>
                    </div>
                    <div class="feature">
                        <h3>Save Tools</h3>
                        <p>Save tools to your account so you can view them later.</p>
                    </div>
                </div>
            </section>

            <!-- How to Use Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('howTo')" :class="{ 'active': openSections.howTo }">
                    <h2>How to Use WebToolKit</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.howTo">
                    <div class="steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <p>Browse or search for tools using our intuitive interface</p>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <p>Filter tools by category, pricing and many more filters</p>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <p>Read reviews and see other alternatives</p>
                        </div>
                        <div class="step">
                            <span class="step-number">4</span>
                            <p>Create an account to save tools and write reviews</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Mission Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('mission')"
                    :class="{ 'active': openSections.mission }">
                    <h2>Our Mission</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.mission">
                    <p>At WebToolKit, our mission is to:</p>
                    <ul>
                        <li>Simplify tool discovery for web developers</li>
                        <li>Promote amazing web tools</li>
                    </ul>
                </div>
            </section>

            <!-- Contribute Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('contribute')"
                    :class="{ 'active': openSections.contribute }">
                    <h2>How to Contribute</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.contribute">
                    <div class="feature">
                        <h3>Contributing to WebToolKit</h3>
                        <p>While direct tool submission is not available yet, you can contribute by:</p>
                        <ul>
                            <li>Contacting the creators on GitHub with your suggestions</li>
                        </ul>
                        <p class="note">We're actively working on making tool submissions available directly through the
                            platform!</p>
                    </div>
                </div>
            </section>

            <!-- Tech Stack Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('stack')" :class="{ 'active': openSections.stack }">
                    <h2>Our Tech Stack</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.stack">
                    <div class="tech-stack">
                        <div class="tech-group">
                            <h3>Design</h3>
                            <ul>
                                <li>Figma</li>
                            </ul>
                        </div>
                        <div class="tech-group">
                            <h3>Frontend</h3>
                            <ul>
                                <li>Nuxt</li>
                                <li>SCSS</li>
                            </ul>
                        </div>
                        <div class="tech-group">
                            <h3>Backend</h3>
                            <ul>
                                <li>Nuxt</li>
                                <li>MongoDB</li>
                                <li>Mongoose</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Authors Section -->
            <section class="wiki-section">
                <div class="section-header" @click="toggleSection('authors')"
                    :class="{ 'active': openSections.authors }">
                    <h2>Creators of WebToolKit</h2>
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
                <div class="section-content" v-if="openSections.authors">
                    <div class="authors">
                        <div class="author">
                            <h3>Andrej Pečeňa</h3>
                            <NuxtLink to="https://github.com/JosefinaTrojkarova">Andrej's Github</NuxtLink>
                        </div>
                        <div class="author">
                            <h3>Pavel Olyšar</h3>
                            <NuxtLink to="https://github.com/PavelOlysar">Pavel's Github</NuxtLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
type SectionKey = 'about' | 'features' | 'howTo' | 'mission' | 'contribute' | 'stack' | 'authors';

interface Sections {
    about: boolean;
    features: boolean;
    howTo: boolean;
    mission: boolean;
    contribute: boolean;
    stack: boolean;
    authors: boolean;
}

const openSections = ref<Sections>({
    about: false,
    features: false,
    howTo: false,
    mission: false,
    contribute: false,
    stack: false,
    authors: false
});

const toggleSection = (section: SectionKey) => {
    openSections.value[section] = !openSections.value[section];
};
</script>

<style scoped lang="scss">
.wiki {
    max-width: 1200px;
    margin: 0 auto;
    padding: $xxl;

    .wiki-header {
        text-align: center;
        margin-bottom: $xxl;

        h1 {
            color: $primary-400;
            margin-bottom: $m;
        }

        p {
            color: $primary-300;
            font-size: 1.2rem;
        }
    }

    .wiki-sections {
        display: flex;
        flex-direction: column;
        gap: $xl;
    }

    .wiki-section {
        border: 1px solid $primary-200;
        border-radius: $m;
        overflow: hidden;

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: $l $xl;
            background-color: $system-bg;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background-color: $primary-100;
            }

            &.active {
                border-bottom: 1px solid $primary-200;

                .material-symbols-rounded {
                    transform: rotate(180deg);
                }
            }

            h2 {
                color: $primary-400;
                font-size: 1.5rem;
            }

            .material-symbols-rounded {
                color: $primary-300;
                transition: transform 0.2s ease;
            }
        }

        .section-content {
            padding: $xl;
            background-color: $system-bg;
            transform-origin: top;
            overflow: hidden;

            @media (max-width: 768px) {
                padding: $l;
            }

            @media (max-width: 480px) {
                padding: $m;
            }

            ul {
                list-style-type: none;
                padding: 0;
                margin: $m 0;

                li {
                    display: flex;
                    align-items: center;
                    gap: $s;
                    padding: $s 0;
                    color: $primary-300;

                    &:before {
                        content: "•";
                        color: $secondary-400;
                        font-weight: bold;
                    }
                }
            }

            .feature {
                margin-bottom: $l;

                h3 {
                    font-size: $xl;
                    color: $primary-400;
                    margin-bottom: $s;
                }

                p {
                    color: $primary-300;
                }
            }

            .steps {
                display: flex;
                flex-direction: column;
                gap: $l;

                .step {
                    display: flex;
                    align-items: center;
                    gap: $l;

                    .step-number {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 2rem;
                        height: 2rem;
                        background-color: $secondary-400;
                        color: white;
                        border-radius: 50%;
                        font-weight: bold;
                    }

                    p {
                        color: $primary-300;
                    }
                }
            }
        }

        .tech-stack {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: $l;

            .tech-group {
                padding: $xl;
                background-color: $system-bg;
                border: 1px solid $primary-200;
                border-radius: $m;
                transition: all 0.2s ease;

                &:hover {
                    border-color: $primary-300;
                }

                h3 {
                    color: $primary-400;
                    margin-bottom: $l;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: $s;

                    &:before {
                        content: "⚡";
                        color: $secondary-400;
                        font-size: 1.1rem;
                    }
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;

                    li {
                        color: $primary-300;
                        padding: $s 0;
                        display: flex;
                        align-items: center;
                        gap: $s;

                        &:before {
                            content: "•";
                            color: $secondary-400;
                        }
                    }
                }
            }
        }

        .authors {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: $l;

            .author {
                padding: $xl;
                background-color: $system-bg;
                border: 1px solid $primary-200;
                border-radius: $m;
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;

                &:hover {
                    border-color: $primary-300;
                }

                h3 {
                    color: $primary-400;
                    margin-bottom: $m;
                    font-size: 1.2rem;
                }

                a {
                    color: $secondary-400;
                    text-decoration: none;
                    padding: $s;
                    border-radius: $xs;
                    transition: all 0.2s ease;
                    background-color: $primary-100;
                    display: inline-flex;
                    align-items: center;
                    gap: $s;
                    font-weight: 500;

                    &:hover {
                        background-color: $secondary-400;
                        color: white;
                    }

                    &:before {
                        content: "🔗";
                        font-size: 0.9em;
                    }
                }
            }
        }
    }
}

.note {
    margin-top: $m;
    color: $secondary-400;
    font-style: italic;
}
</style>