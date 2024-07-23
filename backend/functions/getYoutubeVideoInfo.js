const { YoutubeTranscript } = require("youtube-transcript");
const API_KEY = process.env.YOUTUBE_API_KEY;

const fetchMetadata = async (videoId) => {
  const returnObj = { title: "", description: "" };

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      returnObj.title = data?.items?.[0]?.snippet?.title;
      returnObj.description = data?.items?.[0]?.snippet?.description;
    }
  } catch (error) {}

  return returnObj;
};

const fetchTranscript = async (videoId) => {
  let transcriptText = "";

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    transcriptText = transcript.map((item) => item.text).join(" ");
  } catch (error) {}

  return transcriptText;
};

module.exports = { fetchMetadata, fetchTranscript };
