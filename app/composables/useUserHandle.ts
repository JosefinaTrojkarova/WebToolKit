export const useUserHandle = () => {
  const handle = ref<string | null>(null);
  const error = ref<string | null>(null);
  interface UserHandleResponse {
    handle: string;
  }

  const fetchHandle = async (email: string) => {
    error.value = null;
    handle.value = null;

    try {
      const response = await useFetch<UserHandleResponse>(
        `/api/user/handle/${email}`,
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
            error.value = 'Failed to fetch user handle';
        }
        return;
      }

      if (response.data.value) {
        handle.value = response.data.value.handle;
      }
    } catch (e) {
      error.value = 'An unexpected error occurred';
      console.error('Error fetching user handle:', e);
    }
  };

  return {
    handle,
    error,
    fetchHandle,
  };
};
