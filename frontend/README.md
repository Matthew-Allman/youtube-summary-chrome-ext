<img src="src/assets/img/icon-128.png" width="64"/>

# Frontend for YouTube Video Summarizer Chrome Extension

This frontend, built with React, Tailwind, and Webpack, is the user interface for the YouTube Video Summarizer Chrome Extension.

## Setup

1. **Update API URL**

    Go to the file `frontend/src/pages/Popup/Popup.jsx` and change the `API_URL` variable to match the URL of your backend server. Make sure the port matches the one you set in your `.env` file for the backend.

    ```jsx
    const API_URL = "http://localhost:your_port_number";
    ```

2. **Install Dependencies**

    Navigate to the `frontend` folder and run:

    ```bash
    npm install
    ```

3. **Start the Frontend**

    ```bash
    npm start
    ```
    
4. **Load the Extension in Chrome**

    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode" by toggling the switch in the top right corner.
    - Click on "Load unpacked" and select the `frontend/build` folder of the repository.

## Usage

- **Summarize by URL/Video ID**: Highlight or type in the YouTube URL or video ID, then click summarize.
- **Summarize Current URL**: Click the button to summarize the currently opened YouTube video.
- **Summarize by Description**: Highlight or type in a YouTube video description. The extension will fetch the top 3 related videos, and you can select one to summarize.

## Contributing

Feel free to fork the repository and make improvements. Pull requests are welcome.

## License

This project is open-source and available under the [MIT License](../LICENSE).
