// Fetches Reddit discussion info using the Reddit oEmbed API - NOT WORKING
interface RedditOEmbedResponse {
  title: string;
  author_name: string;
  provider_name: string;
  type: string;
  height: number;
  width: number;
  html: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

export async function getRedditDiscussionInfo(url: string): Promise<{
  title: string;
  authorName: string;
  thumbnailUrl?: string;
  replyCount?: number;
}> {
  try {
    const oembedUrl = `https://www.reddit.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RedditOEmbedResponse = await response.json();

    return {
      title: data.title,
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch (error) {
    console.error('Error fetching Reddit discussion info:', error);
    return {
      title: 'Unknown Title',
      authorName: 'Unknown Author',
    };
  }
}