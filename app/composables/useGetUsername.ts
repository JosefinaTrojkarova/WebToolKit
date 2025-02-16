export const useUsername = () => {
  interface UsernameResponse {
    username: string
  }

  const fetchUsername = async (email: string): Promise<string> => {
    try {
      const response = await $fetch<UsernameResponse>(
        `/api/user/username/${email}`
      )
      return response.username
    } catch (e: any) {
      console.error('Error fetching user username:', e)
      return ''
    }
  }

  return {
    fetchUsername,
  }
}
