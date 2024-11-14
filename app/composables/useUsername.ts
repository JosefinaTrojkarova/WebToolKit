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
      const response = await useFetch<UsernameResponse>(
        `/api/user/username/${email}`,
        { method: 'GET' }
      );

      if (response.error.value) {
        const statusCode = response.error.value?.statusCode;
        switch (statusCode) {
          case 400:
            error.value = 'Email is required';
            break;
          case 404:
            error.value = 'User not found';
            break;
          default:
            error.value = 'Failed to fetch user username';
        }
        return;
      }

      if (response.data.value) {
        username.value = response.data.value.username;
      }
    } catch (e) {
      error.value = 'An unexpected error occurred';
      console.error('Error fetching user username:', e);
    }
  };

  return {
    username,
    error,
    fetchUsername,
  };
};
