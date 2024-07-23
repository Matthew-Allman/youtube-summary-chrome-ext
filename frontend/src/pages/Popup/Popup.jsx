import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [currUrl, setCurrUrl] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const fetchSelectedText = () => {
    chrome.runtime.sendMessage({ action: 'getSelectedText' }, (response) => {
      console.log(response);

      setSelectedText(response?.selectedText);
    });
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
    console.log('selectedText1', selectedText);
  }, [selectedText]);

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
              <button className="w-[40%] h-[40px] bg-green-500 hover:bg-green-600 transition duration-300 rounded-md text-white font-medium text-[14px]">
                Summarize Current Video
              </button>
            ) : (
              <button className="w-[40%] h-[40px] bg-green-600 cursor-not-allowed rounded-md text-white font-medium text-[14px]">
                Summarize
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
                  placeholder="Optional..."
                  type="text"
                  className=" w-[60%] h-[40px] border-2 border-black pl-3 rounded-md text-[14px]"
                />
                <button className="w-[40%] h-[40px] bg-green-500 hover:bg-green-600 rounded-md text-white font-medium text-[14px]">
                  Summarize
                </button>
              </span>
            </div>
          ) : selected === 'name' ? (
            <div></div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Popup;
