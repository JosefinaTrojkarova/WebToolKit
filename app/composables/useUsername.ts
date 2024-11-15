export const useUsername = () => {
  const username = ref<string | null>(null);
  const error = ref<string | null>(null);
  interface UsernameResponse {
    username: string;
  }

  const fetchUsername = async (email: string) => {
    error.value = null;
    username.value = null;

    try {
      const response = await $fetch<UsernameResponse>(
        `/api/user/username/${email}`,
        { method: 'GET' }
      );

      username.value = response.username;
    } catch (e: any) {
      if (e.response?.status === 400) {
        error.value = 'Email is required';
      } else if (e.response?.status === 404) {
        error.value = 'User not found';
      } else {
        error.value = 'Failed to fetch user username';
      }
      console.error('Error fetching user username:', e);
    }
  };

  return {
    username,
    error,
    fetchUsername,
  };
};
