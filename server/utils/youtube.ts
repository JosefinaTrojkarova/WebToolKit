// Fetch video duration using YouTube API, format it, and return it
import { google } from 'googleapis'

// Create a new YouTube client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

// ISO duration converter function
function formatDuration(isoDuration: string): string {
  // Check if the duration is in the expected ISO format
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return 'Invalid duration'

  // Parse the duration into a readable format
  const hours = parseInt(match[1] || '0') || 0
  const minutes = parseInt(match[2] || '0') || 0
  const seconds = parseInt(match[3] || '0') || 0

  return `${hours ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export async function getVideoDurationFromYouTube(videoId: string): Promise<string> {
  try {
    const response = await youtube.videos.list({
      part: ['contentDetails'],
      id: [videoId]
    })

    const isoDuration = response.data.items?.[0]?.contentDetails?.duration
    if (!isoDuration) {
      console.warn('Duration not found in the response')
      return 'Unknown'
    }

    return formatDuration(isoDuration)
  } catch (error) {
    console.error('Error fetching YouTube video duration:', error)
    return 'Unknown'
  }
}