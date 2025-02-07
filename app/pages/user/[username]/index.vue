<template>
    <main>
        <div v-if="error" class="error">
            <p>Error: {{ error.message }}</p>
        </div>
        <div v-else-if="data" class="profile">
            <section class="profile-header">
                <img :src="data.user.image" alt="Profile picture" class="profile-image" />
                <div class="profile-info">
                    <h1>{{ data.user.name }}</h1>
                    <p class="name">@{{ username }}</p>
                </div>
            </section>

            <UserTools :saves="saves" :reviews="contributions" reviews-title="Contributions" />
        </div>
    </main>
</template>

<script setup lang="ts">
const { getSaveTool } = useSaveTool();
const { getUserReview } = useReviewTool();
const { getToolName } = useGetToolName();

interface SavedTool {
    id: string;
    name: string;
}

interface Contribution {
    _id: string;
    toolId: string;
    toolName?: string;
    comment: string;
    rating: number;
    date: Date;
}

type PublicUser = {
    user: {
        username: string;
        name: string;
        email: string;
        image: string;
    }
}

const route = useRoute();
const username = route.params.username as string;

const saves = ref<SavedTool[] | null>(null);
const contributions = ref<Contribution[] | null>(null);

const { data, error } = await useFetch<PublicUser>(`/api/user/${username}`);

if (data.value?.user.email) {
    const saveToolResult = await getSaveTool(data.value?.user.email);
    if (saveToolResult?.saves) {
        const savedToolsWithNames = await Promise.all(
            saveToolResult.saves.map(async (toolId: string) => {
                try {
                    const toolName = await getToolName(toolId);
                    return { id: toolId, name: toolName || toolId };
                } catch (error) {
                    console.error('Error fetching tool name:', error);
                    return { id: toolId, name: toolId };
                }
            })
        );
        saves.value = savedToolsWithNames;
    }

    const contributionsResult = await getUserReview(data.value?.user.email) as Contribution[];
    const contributionsWithNames = await Promise.all(
        contributionsResult.map(async (contribution) => {
            try {
                const toolName = await getToolName(contribution.toolId);
                return { ...contribution, toolName: toolName || contribution.toolId };
            } catch (error) {
                console.error('Error fetching tool name:', error);
                return { ...contribution, toolName: contribution.toolId };
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

.error {
    padding: $l;
    color: $system-error;
    background-color: rgba($system-error, 0.1);
    border-radius: $m;
}
</style>