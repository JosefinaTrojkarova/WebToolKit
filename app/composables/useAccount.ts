export const useAccount = () => {
  const error = ref<string | null>(null);

  const deleteAccount = async (email: string) => {
    error.value = null;

    try {
      const response = await useFetch(`/api/user/${email}`, {
        method: 'DELETE',
      });

      if (response.error.value) {
        throw new Error(response.error.value.statusMessage);
      }

      await navigateTo('/');
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete account';
      throw error.value;
    }
  };

  return {
    error,
    deleteAccount,
  };
};
