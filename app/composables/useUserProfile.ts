interface PublicUser {
  user: {
    username: string
    name: string
    email: string
    image: string
  }
}

interface SavedTool {
  _id: string
  name: string
  logo: string
}

interface Contribution {
  _id: string
  toolId: string
  comment: string
  rating: number
  date: Date
  name?: string
  username?: string
  userProfilePic?: string
  userContributions?: number
}

export function useUserProfile() {
  const saves = ref<SavedTool[] | null>(null)
  const contributions = ref<Contribution[] | null>(null)
  const userData = ref<PublicUser | null>(null)
  const error = ref<string | null>(null)

  const fetchUserSaves = async (email: string) => {
    const { getSaveTool } = useSaveTool()
    try {
      const saveToolResult = await getSaveTool(email)

      if (saveToolResult?.saves) {
        const savedToolsDetails = await Promise.all(
          saveToolResult.saves.map(async (toolName: string) => {
            try {
              const tool = await $fetch<SavedTool>(`/api/tool/${toolName}`)
              return {
                _id: tool._id,
                name: tool.name,
                logo: tool.logo,
              }
            } catch (e) {
              console.error(`Failed to fetch tool ${toolName}:`, e)
              return null
            }
          })
        )
        saves.value = savedToolsDetails.filter(
          (tool): tool is SavedTool => tool !== null
        )
      }
    } catch (e) {
      console.error('Error fetching saves:', e)
      error.value = 'Failed to fetch saved tools'
    }
  }

  const fetchUserContributions = async (
    email: string,
    user: PublicUser['user']
  ) => {
    const { getUserReview } = useReviewTool()
    try {
      const contributionsResult = (await getUserReview(email)) as Contribution[]

      const enhancedContributions = await Promise.all(
        contributionsResult.map(async (contribution) => {
          try {
            const tool = await $fetch<{ name: string; logo: string }>(
              `/api/tool/${contribution.toolId}/stack`
            )
            return {
              ...contribution,
              name: user.name,
              username: user.username,
              userEmail: user.email,
              userProfilePic: user.image,
              userContributions: contributionsResult.length,
              tool: {
                name: tool.name,
                logo: tool.logo,
              },
            }
          } catch (e) {
            console.error(`Failed to enhance contribution:`, e)
            return contribution
          }
        })
      )
      contributions.value = enhancedContributions
    } catch (e) {
      console.error('Error fetching contributions:', e)
      error.value = 'Failed to fetch user contributions'
    }
  }

  const fetchUserProfile = async (username: string) => {
    error.value = null
    try {
      const { data } = await useFetch<PublicUser>(`/api/user/${username}`)
      userData.value = data.value || null

      if (data.value?.user.email) {
        await Promise.all([
          fetchUserSaves(data.value.user.email),
          fetchUserContributions(data.value.user.email, data.value.user),
        ])
      }
    } catch (e) {
      console.error('Error fetching user profile:', e)
      error.value = 'Failed to fetch user profile'
    }
  }

  return {
    saves,
    contributions,
    userData,
    error,
    fetchUserProfile,
  }
}
