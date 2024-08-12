// API to retrieve the preview data for a resource - TEMPORARY SOLUTION, NEEDS IMPROVEMENT
import { defineEventHandler, H3Event } from 'h3'
import { load } from 'cheerio';
import { getVideoDurationFromYouTube } from '~~/server/utils/youtube'
import { getRedditDiscussionInfo } from '~~/server/utils/reddit'

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const url = query.url as string
  const type = query.type as 'article' | 'video' | 'discussion'

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required',
    })
  }

  try {
    let response = undefined
    let html = undefined
    let $ = undefined

    let title = undefined
    let description = undefined
    let image = undefined
    let length = undefined
    let source = new URL(url).hostname

    if (type === 'video') {
      if (source.includes('youtube.com') || source.includes('youtu.be')) {
        const videoId = new URL(url).searchParams.get('v') || url.split('/').pop()
        if (videoId) {
          const duration = await getVideoDurationFromYouTube(videoId)
          length = duration

          response = await fetch(url)
          html = await response.text()
          $ = load(html)

          title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
          description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
          image = $('meta[property="og:image"]').attr('content') || ''
        }
      }
    } else if (type === 'discussion') {
      if (source.includes('reddit.com')) {
        const discussionInfo = await getRedditDiscussionInfo(url)
        title = discussionInfo.title,
          length = discussionInfo.authorName,
          image = discussionInfo.thumbnailUrl
      }
    } else {
      response = await fetch(url)
      html = await response.text()
      $ = load(html)

      title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
      description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
      image = $('meta[property="og:image"]').attr('content') || ''
    }

    return {
      title,
      description,
      image,
      source,
      length
    }
  } catch (error) {
    console.error('Error fetching link preview:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch link preview',
    })
  }
})