# Quiz-pulse
A simple application where users can answer quiz,see their scores right away ,filter questions by topic and save high scores to a back end database that fetch questions from an API based on category.


## Objectives
* Provide an intuitive, responsive interface for configuring custom trivia quizzes by category, difficulty, and question count.
* Fetch and display questions from the Open Trivia Database API via a custom Cloudflare Worker proxy server to handle request routing and CORS.
* Implement real-time answer verification with visual indicators for correct and incorrect responses.
* Maintain rate-limiting protection with a 5-second cooldown to prevent API request spamming.
* Persist completed quiz results and detailed question breakdowns locally using the browser `localStorage` API.
* Structure frontend code modularly into ES Modules (`app.js`, `api.js`, `state.js`, `utils.js`) for clean separation of concerns.


## Technologies Used
* **HTML**: Page structure and semantic markup.
* **CSS**: Layout design, card components, and interactive button states.
* **JavaScript (ES6 Modules)**: Async API calls, DOM manipulation, state management, and utility helpers.
* **Open Trivia Database (OpenTDB) API**: Source for trivia question data.
* **Cloudflare Workers**: Custom proxy handling endpoint requests and CORS headers.
* **Browser LocalStorage API**: Client-side history storage.


## API Endpoints

### Open Trivia Database Endpoint (Target)
* **URL**: `https://opentdb.com/api.php`
* **Method**: `GET`
* **Query Parameters**:
  * `amount`: Number of questions requested (`5`, `10`, or `15`).
  * `category`: Category ID (e.g., `9` for General Knowledge, `18` for Computers, `17` for Science).
  * `difficulty`: Difficulty level (`easy`, `medium`, `hard`, or `""` for any).
  * `type`: Set to `multiple` for multiple-choice questions.

### Proxy Endpoint (Used in Code)
* **URL**: `https://utestproxy.kipkoechdun676.workers.dev/`
* **Method**: `GET`
* **Query Parameter**:
  * `url`: Encoded target URL (e.g., `https://utestproxy.kipkoechdun676.workers.dev/?url=<ENCODED_OPENTDB_URL>`).


## Setup Instructions

### Prerequisites
* A modern web browser (Chrome, Firefox, Edge, or Safari).
* A local web server extension or tool to support JavaScript ES Modules (`type="module"`).

### Step-by-Step Local Setup


# How to access locally
 Navigate into the project directory
- Clone or download this repository to your computer    (git clone - git@github.com:Ashley-tracy/Quiz-pulse.git)
- Open the project folder that Git created               (cd quiz-pulse)
- Double click the new project folder to open it,then the code files from there

 or alternative using vs code 
 - Open the project folder in vs code 
 - Install the live server extension
 - Open index.html and click go live on the bottom right.
