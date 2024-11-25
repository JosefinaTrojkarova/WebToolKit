// import { defineEventHandler, H3Event } from 'h3'
// import { load } from 'cheerio'
// import type { CheerioAPI } from 'cheerio'
// import { getVideoDetailsFromYouTube } from '~~/server/utils/youtube'
// import { getRedditDiscussionInfo } from '~~/server/utils/reddit'

// interface PreviewData {
//   title: string
//   description: string
//   date?: string
//   age?: string
//   image: string
//   source: string
//   length?: string
//   replyCount?: number
// }

// async function fetchAndParse(url: string): Promise<CheerioAPI> {
//   const response = await fetch(url)
//   const html = await response.text()
//   return load(html)
// }

// function extractMetaData($: CheerioAPI): Partial<PreviewData> {
//   return {
//     title: $('meta[property="og:title"]').attr('content') || $('title').text() || 'No title available',
//     description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || 'No description available',
//     date: $('meta[property="article:published_time"]').attr('content') ||
//       $('meta[name="date"]').attr('content') ||
//       $('meta[name="last-modified"]').attr('content') ||
//       $('meta[property="og:updated_time"]').attr('content') || '',
//     image: $('meta[property="og:image"]').attr('content') || '',
//   }
// }

// function calculateAge(dateString: string): string {
//   if (!dateString) return 'No date available'

//   const pageDate = new Date(dateString)
//   if (isNaN(pageDate.getTime())) return 'Invalid date'

//   const now = new Date()
//   const ageInMilliseconds = now.getTime() - pageDate.getTime()

//   const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24))

//   return `${ageInDays} days ago`
// }

// function calculateAgeFromUnix(timestamp: string) {
//   const pageDate = new Date((timestamp as unknown) as number * 1000)
//   const now = new Date()
//   const ageInMilliseconds = now.getTime() - pageDate.getTime()

//   const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24))

//   return `${ageInDays} days ago`
// }

// async function getYouTubePreview(url: string): Promise<PreviewData> {
//   const videoId = new URL(url).searchParams.get('v') || url.split('/').pop()
//   if (!videoId) throw new Error('Invalid YouTube URL')

//   const [youtubeData, $] = await Promise.all([
//     getVideoDetailsFromYouTube(videoId),
//     fetchAndParse(url)
//   ])

//   const metadata = extractMetaData($)
//   const age = calculateAge(youtubeData.uploadDate || metadata.date || '')

//   return {
//     title: metadata.title || 'No title available',
//     description: metadata.description || 'No description available',
//     image: metadata.image || '',
//     source: new URL(url).hostname,
//     length: youtubeData.duration,
//     date: age || '',
//   }
// }

// async function getRedditPreview(url: string): Promise<PreviewData> {
//   const { title, content, authorName, thumbnailUrl, replyCount, created } = await getRedditDiscussionInfo(url)
//   const age = calculateAgeFromUnix(created || '')

//   return {
//     title: title || 'No title available',
//     description: content || 'No description available',
//     image: thumbnailUrl || 'https://external-preview.redd.it/eqmQvZxwlkKfm63m2WsOsjqUbK98g27any8_q_NUZrM.jpg?width=320&amp;crop=smart&amp;auto=webp&amp;s=dda750e979c2cd247dbbb2746b1654238488fe05',
//     source: new URL(url).hostname,
//     replyCount: replyCount,
//     date: age || '',
//   }
// }

// async function getGenericPreview(url: string): Promise<PreviewData> {
//   const $ = await fetchAndParse(url)
//   const metadata = extractMetaData($)
//   const age = calculateAge(metadata.date || '')

//   return {
//     title: metadata.title || 'No title available',
//     description: metadata.description || 'No description available',
//     date: age || '',
//     image: metadata.image || '',
//     source: new URL(url).hostname
//   }
// }

// export default defineEventHandler(async (event: H3Event) => {
//   const query = getQuery(event)
//   const url = query.url as string
//   const type = query.type as 'article' | 'video' | 'discussion'

//   if (!url) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'URL is required',
//     })
//   }

//   try {
//     const source = new URL(url).hostname

//     if (type === 'video' && (source.includes('youtube.com') || source.includes('youtu.be'))) {
//       return await getYouTubePreview(url)
//     } else if (type === 'discussion' && source.includes('reddit.com')) {
//       return await getRedditPreview(url)
//     } else {
//       return await getGenericPreview(url)
//     }
//   } catch (error) {
//     console.error('Error fetching link preview:', error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to fetch link preview',
//     })
//   }
// })
