# Quiz-pulse
**Quiz-pulse** is an interactive web-based trivia application that lets users test their knowledge across various topics, customize quiz settings, receive instant visual feedback, and track their quiz history locally in the browser.



## Live Demo Links

* **Live Application Link:**https://shiny-cannoli-64bc54.netlify.app/
* **GitHub Repository Link:** https://github.com/Ashley-tracy/Quiz-pulse.git
* **Figma wireframe link::**[https://www.figma.com/design/LbFNL1r1o98xIK85RqiHiy/QUIZ-PULSE?node-id=0-1&t=ZffPsSB2GSWeWNg7-1]

## Features list
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


## Technology used

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
* **API**: [Open Trivia Database (OpenTDB)](https://opentdb.com/)
* **Proxy**: Cloudflare Workers (CORS & request routing)
* **Storage**: Browser `localStorage` API
* **Testing**: Jest (with `jest-environment-jsdom` and `@babel/preset-env`)

## How to run it locally
1. Open the terminal and clone the repository:

   ```bash
   git clone git@github.com:Ashley-tracy/Quiz-pulse.git
   ```

2. Navigate into the project directory:

   cd Quiz-pulse

3. Install project dependencies:

   npm install

4. Start the  test runner:

   
   npm test

5. Open `home.html` in your web browser (or use the VS Code Live Server extension) to view the application live.


## What I Learned
* **Organizing Code into Separate Files:** Instead of keeping all my code in one huge file, I learned how to split it into four simple JavaScript files (`app.js`, `api.js`, `state.js`, and `utils.js`). This makes the code much easier to read, update, and fix.
* **Connecting APIs & Fixing CORS Errors:** I learned why browsers block web pages from directly downloading data from other websites (CORS) and how routing requests through a proxy server solves this problem.
* **Saving Quiz History in the Browser:** I learned how to use `localStorage` so user scores and previous quiz details stay saved even after refreshing or closing the browser.
