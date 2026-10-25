# Quiz-pulse

**Quiz-pulse** is an interactive web-based trivia application that lets users test their knowledge across various topics, customize quiz settings, receive instant visual feedback, and track their quiz history locally in the browser.



## Live Demo & Links

* **Live Application Link:** [View Live App](https://your-live-app-link.com)
* **GitHub Repository Link:** [View Code Repository] (git@github.com:Ashley-tracy/Quiz-pulse.git)
* **Figma wireframe link::**[https://www.figma.com/design/LbFNL1r1o98xIK85RqiHiy/QUIZ-PULSE?node-id=0-1&t=ZffPsSB2GSWeWNg7-1]

## Features
* **Custom Quiz Configuration**: Select from 8 trivia categories (General Knowledge, Science, Computers, History, Geography, Films, Music, Sports), choose difficulty levels (Easy, Medium, Hard), and set question amounts (5, 10, or 15 questions).
* **Dynamic API Integration**: Fetches multiple-choice trivia questions from the Open Trivia Database (OpenTDB) via a custom Cloudflare Worker proxy server.
* **Rate-Limit Prevention**: Built-in 5-second cooldown timer on starting new quizzes to prevent API throttling.
* **Interactive Interface**: 
  * Real-time answer validation with color-coded feedback (green for correct, red for incorrect).
  * HTML entity decoding and randomized answer choice shuffling.
  * Question navigation with "Previous" and "Next/Finish" buttons.
* **Local Quiz History**: Automatically saves completed quiz results and detailed question-by-question breakdowns to browser `localStorage`.
* **Expandable History Logs**: View question details or delete specific history records at any time.
* **Modular Codebase**: Built using modern JavaScript ES Modules (`app.js`, `api.js`, `state.js`, `utils.js`).


## Tech Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
* **API**: [Open Trivia Database (OpenTDB)](https://opentdb.com/)
* **Proxy**: Cloudflare Workers (CORS & request routing)
* **Storage**: Browser `localStorage` API
* **Testing**: Jest (with `jest-environment-jsdom` and `@babel/preset-env`)


## File Structure

```text
Quiz-pulse/
├── index.html        # Main HTML layout
├── styles.css        # Application styles
├── app.js            # Main DOM event handlers and application workflow
├── api.js            # API fetch requests and proxy URL construction
├── state.js          # Application state & localStorage history management
├── utils.js          # Helper functions (HTML decoding, array shuffling)
├── api.test.js       # Unit tests for API fetch operations
├── state.test.js     # Unit tests for state management & localStorage
├── utils.test.js     # Unit tests for helper utilities
├── babel.config.json # Babel configuration for ES Module testing
└── README.md         # Project documentation

## What I Learned

* **Cleaning Up Weird Question Text:** Trivia APIs often return symbols like `&quot;` instead of `"`. I learned how to automatically decode these HTML symbols into normal readable text before showing questions to the user.
* **Organizing Code into Separate Files:** Instead of keeping all my code in one huge file, I learned how to split it into four simple JavaScript files (`app.js`, `api.js`, `state.js`, and `utils.js`). This makes the code much easier to read, update, and fix.
* **Connecting APIs & Fixing CORS Errors:** I learned why browsers block web pages from directly downloading data from other websites (CORS) and how routing requests through a proxy server solves this problem.
* **Saving Quiz History in the Browser:** I learned how to use `localStorage` so user scores and previous quiz details stay saved even after refreshing or closing the browser.
* **Writing Automated Tests:** I learned how to write simple tests with Jest to make sure helper functions (like shuffling answer buttons or saving history) work as expected without having to manually test everything in the browser every time.
