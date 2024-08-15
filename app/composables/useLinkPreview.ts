// Composable to retrieve a link preview from a URL - HAS PROBLEMS  
// Problems:
// - The Reddit fetching doesn't work at all
// - The overall fetching is unreliable and sometimes randomly fails
// - The types are defined locally instead of globally
// - There is no chaching mechanism to prevent unnecessary requests
interface LinkPreview {
  title: string
  description: string
  image: string
  source: string
  length: string
  replyCount?: number
}

export function useLinkPreview(link: string, type: string) {
  const preview: Ref<LinkPreview | null> = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchPreview = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`/api/tool/link-preview?url=${encodeURIComponent(link)}&type=${type}`)
      if (!response.ok) throw new Error('Failed to fetch preview')
      preview.value = await response.json()
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  fetchPreview()

  return { preview, loading, error }
}