interface RedditPostData {
  title: string;
  selftext: string;
  author: string;
  thumbnail: string;
  num_comments: number;
}

export async function getRedditDiscussionInfo(url: string): Promise<{
  title: string;
  content: string;
  authorName: string;
  thumbnailUrl: string;
  replyCount: number;
}> {
  try {
    // Remove trailing slash if present and add .json
    const jsonUrl = url.replace(/\/$/, '') + '.json';
    const response = await fetch(jsonUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Chache-Control': 'max-age=0',
        'Cookie': 'rdt=a5098dd14b8325817c5b514a5d4cd020; edgebucket=jB7mxJkzWFGRyGHknO; csv=2; g_state={"i_l":0}; reddit_session=766800914396%2C2024-05-08T12%3A39%3A43%2C5bcd6de981fede170cbb69012c22de43e4b65178; eu_cookie={%22opted%22:true%2C%22nonessential%22:true}; loid=00000000009s9hgs7w.2.1610449289000.Z0FBQUFBQm1PM0tTUnN4YXUyNG1VNk5OWEtfX0FKMzFOZmxmUXpQb25EZzl5bDVja3RjLU1SRzlyd0h5bHR4dVRBc0RMMmNPWEYzcWd0dW9faUlDbUllV0FYclAwemI5UVEwM194M3B5OGNKa3M0NnRqR0RzaHJZVkhISFg5SE5BRUR1cElfX09QMk8; __stripe_mid=24a27f27-d235-428a-8470-ee66ce2442e78df212; pc=lz; token_v2=eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzIzNzA2NTEyLjYxNTc0MiwiaWF0IjoxNzIzNjIwMTEyLjYxNTc0MSwianRpIjoiZEtXUnk3RE5ENVUyQmx0Zmt1V0xuRG5zeUNGMGVnIiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml85czloZ3M3dyIsImFpZCI6InQyXzlzOWhnczd3IiwibGNhIjoxNjEwNDQ5Mjg5MDAwLCJzY3AiOiJlSnhra2RHT3REQUloZC1sMXo3Ql95cF9OaHRzY1lhc0xRYW9rM243RFZvY2s3MDdjTDRpSFA4bktJcUZMRTJ1QktHa0tXRUZXdE9VTmlMdjU4eTlPWkVGU3lGVFI4NDN5d29rYVVwUFVtTjVweWxSd1daa0xsZmFzVUtEQjZZcFZTNloyMEtQUzV2UTNJMUZ6MDZNcWx4V0h0VFlvM0pwYkdNSzJ4UGp6Y1pxUXlxdXk2bE1ZRmtvbjhXTGZ2eUctdFktZjdiZmhIWXdyS2dLRF9UT3VGeHdZX0hERkhiX25wcjBiRjJ3cUwzWGc5US0xLU4yN2JObW9kbTVfVnpQdnphU2NUbUc1aWZZdjd0LUNSMTQ1SG1aVVFjd1lnMF95ckFqNl9Ddk9vREtCUVdNSlloUEk1QXJsMl9fSmRpdVRmOGF0eWQtLUdiRVRXXzRyUm1vNXhMRW9VX2o2emNBQVBfX1hEX2U0dyIsInJjaWQiOiJvRmF5TWNCcHBxeW1teVMtMG5yLVNGY3EzdVFzRFk3RlEtWDM5T0ptOEZzIiwiZmxvIjoyfQ.pwQqZre47i2JVKhS7JOM9aFF9iCQ_ACRPSU8pkmhdYkXHQ3sOeeDXciVnAUoo0nCZY4P_MKF49ZdpiI7t7rDzqhmFQrfovNubYoPhdZ47JmFgEfsRVk-dGlA59ojwanVDTQLjQGqc7762J4KjAwy7haW3zPzwbUCiMu8jFtCn9fLV_7a0UlFMaWxR1tR3o5lhpeXQzNvn74lsmIKv9XSt8fvWCV9Ocj3uSDHJ3mdk0B5YRrST2jmxSJ0DLJau5I3bpRco7GXS2zgfwtJjJg8vQ08-t0hAe6fF4iL2TweIvkcbJnStzNBzBCBC0y7eQMpA5gCo_Qk8Foxip76Ka5BqQ; reddit_chat_view=minimized; t2_9s9hgs7w_recentclicks3=t3_1epteov%2Ct3_1eor21b%2Ct3_1er9og7%2Ct3_1ervz8l%2Ct3_1e8uyen%2Ct3_1ej4v2s%2Ct3_1ek42m5%2Ct3_1ekp3x8%2Ct3_av9xn6%2Ct3_1epsky9; csrf_token=34553e6e074a8cc06063595c1cf1e248; session_tracker=jcpfrfdqobfcadkjdh.0.1723632043896.Z0FBQUFBQm12SW1zdjJJTk1JeVpCN2RkOWRxM0tZdXNIQzNJenBSZDlmUHd3dmk2Y1lqMnBac3d5Rms0LWFzSERfWkZ0by1UMVhkRHV0cGtVdTZJOTJ2a3IyYUE2VUFrVXBkWXdINWlkVDFSMjNJQVMxZF82UDloZ2VFbURZemk3eVltQ202clZCSjc',
        'Dnt': '1',
        'Priority': 'u=0, i',
        'Sec-Ch-Ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }

    const data = await response.json();
    const postData: RedditPostData = data[0].data.children[0].data;

    return {
      title: postData.title,
      content: postData.selftext,
      authorName: postData.author,
      thumbnailUrl: postData.thumbnail !== 'self' ? postData.thumbnail : '',
      replyCount: postData.num_comments
    };
  } catch (error) {
    console.error('Error fetching Reddit discussion info:', error);
    return {
      title: 'Unknown Title',
      content: '',
      authorName: 'Unknown Author',
      thumbnailUrl: '',
      replyCount: 0
    };
  }
}