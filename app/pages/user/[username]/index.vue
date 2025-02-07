<template>
    <main>
        <div v-if="error" class="error">
            <p>Error: {{ error.message }}</p>
        </div>
        <div v-else-if="data" class="profile">
            <!-- Profile Header -->
            <section class="profile-header">
                <img :src="data.user.image" alt="Profile picture" class="profile-image" />
                <div class="profile-info">
                    <h1>{{ data.user.name }}</h1>
                    <p class="name">@{{ username }}</p>
                </div>
            </section>

            <!-- Content Grid -->
            <div class="content-grid">
                <!-- Saves Section -->
                <section class="saves-section">
                    <h2>Saved Tools</h2>
                    <div class="saves-container">
                        <p v-if="!saves?.length" class="empty-state">No saved tools yet</p>
                        <ul v-else class="saves-list">
                            <NuxtLink v-for="(save, index) in saves" :key="index"
                                :to="`/tool/${save.toLowerCase().replace(/\s+/g, '-')}`" class="save-item">
                                <span class="tool-name">{{ save }}</span>
                                <span class="material-symbols-rounded">chevron_right</span>
                            </NuxtLink>
                        </ul>
                    </div>
                </section>

                <!-- Contributions Section -->
                <section class="contributions-section">
                    <h2>Contributions</h2>
                    <div class="contributions-container">
                        <p v-if="!contributions?.length">No contributions yet</p>
                        <ul v-else class="contributions-list">
                            <li v-for="contribution in contributions" :key="contribution._id" class="contribution-card">
                                <div class="contribution-header">
                                    <NuxtLink
                                        :to="`/tool/${(contribution.toolName || contribution.toolId).toLowerCase().replace(/\s+/g, '-')}`"
                                        class="tool-link">
                                        <h3>{{ contribution.toolName || contribution.toolId }}</h3>
                                    </NuxtLink>
                                    <span class="rating">Rating: {{ contribution.rating }}/5</span>
                                </div>
                                <p class="comment">{{ contribution.comment }}</p>
                                <time class="date">{{ new Date(contribution.date).toLocaleDateString() }}</time>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
type PublicUser = {
    user: {
        username: string;
        name: string;
        email: string;
        image: string;
    }
}

interface Contribution {
    _id: string;
    toolName?: string;
    toolId: string;
    comment: string;
    rating: number;
    date: Date;
}

const { getSaveTool } = useSaveTool();
const { getUserReview } = useReviewTool();
const { getToolName } = useGetToolName();

const saves = ref<string[] | null>(null);
const contributions = ref<Contribution[] | null>(null);

const route = useRoute();
const username = route.params.username as string;

const { data, error } = await useFetch<PublicUser>(`/api/user/${username}`);

if (data.value?.user.email) {
    const saveToolResult = await getSaveTool(data.value?.user.email);
    saves.value = saveToolResult?.saves || null;

    const contributionsResult = await getUserReview(data.value?.user.email) as Contribution[];

    // Fetch tool names for each contribution
    const contributionsWithNames = await Promise.all(
        contributionsResult.map(async (contribution) => {
            try {
                const toolName = await getToolName(contribution.toolId);
                console.log('Fetched tool name:', toolName, 'for ID:', contribution.toolId); // Debug log
                return {
                    ...contribution,
                    toolName: toolName || contribution.toolId // Fallback to ID if name fetch fails
                };
            } catch (error) {
                console.error('Error fetching tool name:', error);
                return {
                    ...contribution,
                    toolName: contribution.toolId // Fallback to ID on error
                };
            }
        })
    );

    contributions.value = contributionsWithNames;
}
</script>

<style scoped lang="scss">
main {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    padding: $xxl;
    gap: $xxl;
}

.profile {
    display: flex;
    flex-direction: column;
    gap: $xxl;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: $xl;
    padding: $xl;
    background-color: $system-bg;
    border-radius: $m;
    border: 1px solid $primary-200;

    .profile-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 3px solid $primary-200;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: $s;

        h1 {
            color: $primary-400;
            font-size: 2rem;
        }

        .name {
            color: $primary-300;
            font-size: 1.2rem;
        }
    }
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $xl;

    section {
        h2 {
            margin-bottom: $l;
            color: $primary-400;
        }
    }
}

.contributions-container {
    .contributions-list {
        display: flex;
        flex-direction: column;
        gap: $m;
    }

    .contribution-card {
        padding: $l;
        background-color: $system-bg;
        border: 1px solid $primary-200;
        border-radius: $m;

        .contribution-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $s;

            .tool-link {
                text-decoration: none;

                h3 {
                    color: $primary-400;
                    transition: color 0.2s ease;

                    &:hover {
                        color: $primary-600;
                    }
                }
            }

            .rating {
                color: $secondary-400;
                font-weight: 600;
            }
        }

        .comment {
            margin-bottom: $s;
            color: $primary-300;
        }

        .date {
            font-size: 0.9rem;
            color: $primary-200;
        }
    }
}

.saves-container {
    .saves-list {
        display: flex;
        flex-direction: column;
        gap: $m;
    }

    .save-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $m $l;
        background-color: $system-bg;
        border: 1px solid $primary-200;
        border-radius: $s;
        transition: all 0.2s ease;
        text-decoration: none;
        color: inherit;

        &:hover {
            transform: translateY(-2px);
            box-shadow: $shadow-300;
            background-color: $primary-100;
        }

        .tool-name {
            color: $primary-400;
            font-weight: 500;
        }

        .material-symbols-rounded {
            color: $primary-300;
        }
    }
}

.empty-state {
    text-align: center;
    color: $primary-300;
    padding: $xl;
}


.error {
    padding: $l;
    color: $system-error;
    background-color: rgba($system-error, 0.1);
    border-radius: $m;
}
</style>