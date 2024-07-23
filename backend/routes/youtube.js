const router = require("express").Router();
const { searchYouTubeVideos } = require("../functions/getYoutubeVideos");
const {
  fetchMetadata,
  fetchTranscript,
} = require("../functions/getYoutubeVideoInfo");

const { encoding_for_model } = require("tiktoken");
const OpenAI = require("openai");

const modelMaxContextLength = parseInt(process.env.MAX_CONTEXT_LEN);
const openaiAPIKey = process.env.OPENAI_SK;

const openai = new OpenAI({ apiKey: openaiAPIKey });

router.route("/search").post(async (req, res) => {
  const query = req.body.query;
  const response = await searchYouTubeVideos(query);

  res.send({ videos: response, status: 200 });
});

router.route("/summarize").post(async (req, res) => {
  try {
    const videoID = req.body.videoID;

    const transcriptText = await fetchTranscript(videoID);
    let metaData = {};

    let sysMessage = {};

    if (transcriptText.length > 0) {
      sysMessage = {
        role: "system",
        content:
          "You are a helpful assistant who summarizes Youtube videos in a short, readable, and efficent format given the youtube videos transcript. You send your responses using commonly used HTML tags for better formatting.",
      };
    } else {
      metaData = await fetchMetadata(videoID);

      sysMessage = {
        role: "system",
        content:
          "You are a helpful assistant who summarizes Youtube videos in a short, readable, and efficent format given the youtube videos metadata. You send your responses using commonly used HTML tags for better formatting.",
      };
    }

    const enc = encoding_for_model("gpt-4o-2024-05-13");
    const tokens = enc.encode(
      transcriptText || metaData?.title + metaData?.description
    ).length;

    const availableTokens = parseInt(
      (modelMaxContextLength - tokens).toFixed(0)
    );

    if (availableTokens > 0) {
      const completion = await openai.chat.completions.create({
        messages: [
          sysMessage,
          {
            role: "user",
            content:
              transcriptText || metaData?.title + "\n" + metaData?.description,
          },
        ],
        model: "gpt-4o-mini",
        n: 1,
        temperature: 0.6,
        max_tokens: 5000,
      });

      if (completion?.choices?.[0]?.message) {
        let message = completion.choices[0].message.content;
        message = message.replaceAll("```html", "").replaceAll("```", "");

        res.send({ message, status: 200 });
      } else {
        res.sendStatus(500);
      }
    } else {
      res.send({ errMessage: "Video too long to summarize." });
    }
  } catch (e) {
    console.log(e);

    res.sendStatus(500);
  }
});

module.exports = router;
