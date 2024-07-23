import React, { useState, useEffect, useRef } from 'react';

const Popup = () => {
  const [currUrl, setCurrUrl] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [textData, setTextData] = useState('');

  const fetchSelectedText = () => {
    chrome.runtime.sendMessage({ action: 'getSelectedText' }, (response) => {
      setSelectedText(response?.selectedText);
    });
  };

  const handleURL = async () => {
    setLoading(true);
    setErrMessage('');

    if (urlInput.length > 0 || selectedText.length > 0) {
      const input = urlInput || selectedText;
      const regex = /^[a-zA-Z0-9_-]{11}$/;

      if (
        regex.test(input) ||
        input.startsWith('https://www.youtube.com/watch')
      ) {
        let videoID = '';

        if (regex.test(input)) {
          videoID = input;
        } else {
          const extractRegex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/[^\/]+\/playlist\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

          // Match the URL against the regex
          const match = input.match(extractRegex);

          videoID = match[1];
        }

        setTextData(videoID);
      } else {
        setErrMessage('Please enter a valid Youtube URL or Video ID');
      }
    }

    setLoading(false);
  };

  const handleCurrUrl = async () => {
    const extractRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/[^\/]+\/playlist\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Match the URL against the regex
    const match = currUrl.match(extractRegex);
    const videoID = match[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(videoID)) {
      setTextData(videoID);
    }
  };

  const handleText = async () => {
    const input = textInput || selectedText;
  };

  useEffect(() => {
    fetchSelectedText();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab && currentTab.url) {
        setCurrUrl(currentTab.url);
      }
    });
  }, []);

  useEffect(() => {
    setTextData('');
  }, [selected]);

  return (
    <section className=" w-[500px] h-auto border bg-white">
      <div className=" container mx-auto h-full pt-3 pb-4">
        <div className=" w-full h-full flex flex-col items-start justify-start">
          <h1 className="text-[16px] font-medium text-black">
            AI Youtube Video Summarizer
          </h1>{' '}
          <p className=" text-[14px] leading-tight mt-2">
            Summarize the video you’re currently watching, or choose another
            method to summarize a different video.
          </p>
          <span className=" w-full flex flex-row items-start justify-start mt-4 gap-x-4">
            <select
              defaultValue={'none'}
              className=" w-[60%] h-[40px] border-2 border-black rounded-md py-2 focus:outline-none text-[12px] font-medium cursor-pointer pl-2"
              name="dropdown"
              id="dropdown"
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="none">Select an Option...</option>
              <option value="url">Summarize by Video URL/Video ID</option>
              <option value="name">Summarize by Video Name/Description</option>
            </select>

            {currUrl.includes('https://www.youtube.com/watch') ? (
              <button
                onClick={handleCurrUrl}
                className="w-[40%] h-[40px] bg-green-500 hover:bg-green-600 transition duration-300 rounded-md text-white font-medium text-[14px]"
              >
                Summarize Current Video
              </button>
            ) : (
              <button className="w-[40%] h-[40px] bg-red-600 cursor-not-allowed rounded-md text-white font-medium text-[14px]">
                Invalid URL
              </button>
            )}
          </span>
          {selected === 'url' ? (
            <div className=" mt-4 w-full h-auto flex flex-col items-start justify-start">
              <p className=" text-[13px] leading-tight mt-2 font-medium">
                Highlight a YouTube video URL or ID (e.g., No2HBKimu63) and
                click 'Summarize,' or simply enter it below.
              </p>
              <span className="w-full h-auto mt-2 flex flex-row items-start justify-start gap-x-3">
                <input
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Optional..."
                  type="text"
                  className=" w-[60%] h-[40px] border-2 border-black pl-3 rounded-md text-[14px]"
                />
                <button
                  disabled={!selectedText.length && !urlInput.length}
                  onClick={handleURL}
                  className="w-[40%] h-[40px] bg-green-500 hover:bg-green-600 disabled:bg-green-600 disabled:cursor-not-allowed rounded-md text-white font-medium text-[14px]"
                >
                  {loading ? 'Loading...' : 'Summarize'}
                </button>
              </span>
              {errMessage && (
                <p className="text-[13px] text-red-500 font-medium mt-3">
                  {errMessage}
                </p>
              )}
            </div>
          ) : selected === 'name' ? (
            <div className=" mt-4 w-full h-auto flex flex-col items-start justify-start">
              <p className=" text-[13px] leading-tight mt-2 font-medium">
                Highlight or enter text to search YouTube and find related
                videos for summarization.
              </p>
              <span className="w-full h-auto mt-2 flex flex-row items-start justify-start gap-x-3">
                <input
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Optional..."
                  type="text"
                  className=" w-[60%] h-[40px] border-2 border-black pl-3 rounded-md text-[14px]"
                />
                <button
                  disabled={!selectedText.length && !textInput.length}
                  onClick={handleText}
                  className="w-[40%] h-[40px] bg-green-500 hover:bg-green-600 disabled:bg-green-600 disabled:cursor-not-allowed rounded-md text-white font-medium text-[14px]"
                >
                  {loading ? 'Loading...' : 'Summarize'}
                </button>
              </span>
              {errMessage && (
                <p className="text-[13px] text-red-500 font-medium mt-3">
                  {errMessage}
                </p>
              )}
            </div>
          ) : null}
          {textData.length > 0 && (
            <div className="w-full h-auto max-h-[200px] overflow-y-auto mt-3 flex items-start justify-start">
              <p className="text-[13px] text-black">{textData}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Popup;
