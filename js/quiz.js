document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. State Variables ---
    let selectedCategory = '9'; // Default: General Knowledge
    let selectedDifficulty = ''; // Default: Any
    let selectedAmount = '5'; // Default: 5

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // --- 2. DOM Elements ---
    const setupSection = document.getElementById('setup-section');
    const quizSection = document.getElementById('quiz-section');
    const historySection = document.getElementById('history-section');
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const nextBtn = document.getElementById('next-btn');
    const questionContainer = document.getElementById('question-container');
    const quizResults = document.getElementById('quiz-results');
    const finalScoreText = document.getElementById('final-score');
    const historyContainer = document.getElementById('history-container');

    // --- 3. Setup Logic (Category & Pills) ---

    // Category Selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove "Selected" from all
            categoryCards.forEach(c => {
                const pill = c.querySelector('.selected-pill');
                if (pill) pill.remove();
            });
            
            // Add "Selected" to clicked
            const pill = document.createElement('span');
            pill.className = 'selected-pill';
            pill.textContent = 'Selected';
            card.appendChild(pill);

            // Update state (Mapping card titles to OpenTriviaDB category IDs)
            const title = card.querySelector('h3').textContent;
            if (title.includes('General')) selectedCategory = '9';
            else if (title.includes('Computers')) selectedCategory = '18';
            else if (title.includes('Science')) selectedCategory = '17';
            else if (title.includes('History')) selectedCategory = '23';
            else if (title.includes('Geography')) selectedCategory = '22';
            else if (title.includes('Films')) selectedCategory = '11';
            else if (title.includes('Music')) selectedCategory = '12';
            else if (title.includes('Sports')) selectedCategory = '21';
        });
    });

    // Difficulty & Amount Selection
    const paramGroups = document.querySelectorAll('.param-group');
    paramGroups.forEach(group => {
        const buttons = group.querySelectorAll('.pill-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Visual active state
                buttons.forEach(b => {
                    b.style.opacity = '0.5';
                    b.style.transform = 'scale(1)';
                });
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.05)';

                // Update state based on text
                const text = btn.textContent.trim();
                if (text === 'Easy') selectedDifficulty = 'easy';
                else if (text === 'Medium') selectedDifficulty = 'medium';
                else if (text === 'Hard') selectedDifficulty = 'hard';
                else if (text === 'Any Difficulty') selectedDifficulty = '';
                
                if (text === '5 Questions') selectedAmount = '5';
                else if (text === '10 Questions') selectedAmount = '10';
                else if (text === '15 Questions') selectedAmount = '15';
            });
        });
    });

    // --- 4. Fetch & Start Quiz Logic ---
    startQuizBtn.addEventListener('click', async () => {
        startQuizBtn.textContent = 'Loading...';
        startQuizBtn.disabled = true;
     // Using allorigins proxy to prevent CORS issues
        const apiUrl = `https://api.allorigins.win/raw?url=https://opentdb.com/api.php?amount=${selectedAmount}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.response_code === 0 && data.results.length > 0) {
                quizQuestions = data.results;
                currentQuestionIndex = 0;
                score = 0;

                // Switch screens
                setupSection.style.display = 'none';
                quizSection.style.display = 'block';
                historySection.style.display = 'none';
                quizResults.style.display = 'none';
                nextBtn.style.display = 'none';

                renderQuestion();
            } else if (data.response_code === 5) {
                alert('Rate limit hit! OpenTDB requires 5 seconds between requests. Please wait a moment and try again.');
            } else {
                alert('Could not find enough questions for these settings. Try lowering the difficulty or choosing a different category.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to the quiz API. Please check your internet connection.');
        } finally {
            startQuizBtn.textContent = 'Start Quiz →';
            startQuizBtn.disabled = false;
        }
    });

    // --- 5. Render Question ---
    function renderQuestion() {
        const q = quizQuestions[currentQuestionIndex];
        
        // Function to decode HTML entities (like &quot;)
        const decodeText = (str) => {
            const doc = new DOMParser().parseFromString(str, "text/html");
            return doc.documentElement.textContent;
        };

        const questionText = decodeText(q.question);
        
        // Combine and shuffle answers
        let answers = [...q.incorrect_answers.map(decodeText), decodeText(q.correct_answer)];
        answers = answers.sort(() => Math.random() - 0.5);

        // Build HTML
        questionContainer.innerHTML = `
            <h3 style="color: #d63691;">Question ${currentQuestionIndex + 1} of ${quizQuestions.length}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${questionText}</p>
            <div id="answers-wrapper"></div>
        `;

        const answersWrapper = document.getElementById('answers-wrapper');
        
        answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.onclick = () => checkAnswer(btn, answer, decodeText(q.correct_answer));
            answersWrapper.appendChild(btn);
        });

        nextBtn.style.display = 'none';
    }
    
        // --- 6. Check Answer Logic ---
    function checkAnswer(clickedBtn, selectedAnswer, correctAnswer) {
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            clickedBtn.style.backgroundColor = '#a8e6cf'; // Green
            clickedBtn.style.borderColor = '#1e8449';
            score++;
        } else {
            clickedBtn.style.backgroundColor = '#ffaaa5'; // Red
            clickedBtn.style.borderColor = '#c0392b';
            
            // Highlight the correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.style.backgroundColor = '#a8e6cf'; // Green
                    btn.style.borderColor = '#1e8449';
                }
            });
        }

        nextBtn.style.display = 'block';
    }

    // --- 7. Next Question Logic ---
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    });

    // --- 8. Finish Quiz & History ---
    function finishQuiz() {
        questionContainer.innerHTML = '';
        nextBtn.style.display = 'none';
        quizResults.style.display = 'block';
        
        finalScoreText.textContent = `You scored ${score} out of ${quizQuestions.length}`;
        
        saveHistory(score, quizQuestions.length);
        renderHistory();
        
        // Show history section below results
        historySection.style.display = 'block';
    }

    function saveHistory(score, total) {
        let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        
        const newRecord = {
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            score: score,
            total: total
        };

        history.unshift(newRecord);
        if (history.length > 10) history.pop();
        
        localStorage.setItem('quizHistory', JSON.stringify(history));
    }

    function renderHistory() {
        let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        historyContainer.innerHTML = '';

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No quizzes taken yet.</p>';
            return;
        }

        history.forEach((record, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            div.innerHTML = `
                <div>
                    <strong>Score: ${record.score}/${record.total}</strong>
                    <br><span style="font-size: 0.8rem; color: #666;">${record.date}</span>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            historyContainer.appendChild(div);
        });

        // Attach delete events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteHistory(index);
            });
        });
    }

    function deleteHistory(index) {
        let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        history.splice(index, 1);
        localStorage.setItem('quizHistory', JSON.stringify(history));
        renderHistory();
    }

    // Initialize History on page load
    renderHistory();

});