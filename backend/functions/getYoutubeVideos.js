const API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = 3;

async function searchYouTubeVideos(query) {
  const encQuery = encodeURIComponent(query);

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${MAX_RESULTS}&q=${encQuery}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items) {
      return data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
      }));
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

module.exports = { searchYouTubeVideos };
