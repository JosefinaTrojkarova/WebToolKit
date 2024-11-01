// Composable to retrieve a link preview from a URL and save it in cache - HAS PROBLEMS  
// Problems:
// - The Reddit fetching doesn't work at all
// - The overall fetching is unreliable and sometimes randomly fails
// - The types are defined locally instead of globally
// - There is no chaching mechanism to prevent unnecessary requests
interface LinkPreview {
  title: string
  description: string
  date?: string
  image: string
  source: string
  length: string
  replyCount?: number
}

export function useLinkPreview(link: string, type: string) {
  const preview: Ref<LinkPreview | null> = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Save the link previews in a cache to prevent unnecessary requests
  const linkPreviews = useState<Record<string, LinkPreview>>('linkPreviews', () => ({}))

  const fetchPreview = async () => {
    const cacheKey = `${link}:${type}`

    // Check if the preview is already in the cache
    if (linkPreviews.value[cacheKey]) {
      preview.value = linkPreviews.value[cacheKey]
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await fetch(`/api/tool/link-preview?url=${encodeURIComponent(link)}&type=${type}`)
      if (!response.ok) throw new Error('Failed to fetch preview')
      const data = await response.json()
      preview.value = data
      // Store the fetched data in the cache
      linkPreviews.value[cacheKey] = data
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  fetchPreview()

  return { preview, loading, error }
}