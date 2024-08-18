// Composable function to cache data using nuxtapp
// Used in:

export function useCache() {
  const nuxtApp = useNuxtApp();

  const getCachedData = (key: string) => {
    try {
      if (nuxtApp.isHydrating && nuxtApp.payload.data[key]) {
        return nuxtApp.payload.data[key];
      }
      if (nuxtApp.static.data[key]) {
        return nuxtApp.static.data[key];
      }
    } catch (err) {
      console.error(`Error retrieving cached data for key ${key}:`, err);
    }
    return null;
  };

  const setCachedData = (key: string, data: any) => {
    try {
      if (nuxtApp.static.data) {
        nuxtApp.static.data[key] = data;
      }
    } catch (err) {
      console.error(`Error caching data for key ${key}:`, err);
    }
  };

  return {
    getCachedData,
    setCachedData,
  };
}
