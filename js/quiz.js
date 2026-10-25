document.addEventListener('DOMContentLoaded', () => {

    // --- 1. State Variables ---
    let selectedCategory = '9';
    let selectedDifficulty = '';
    let selectedAmount = '5';

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = []; 

    // --- 2. DOM Elements ---
    const setupSection = document.getElementById('setup-section');
    const quizSection = document.getElementById('quiz-section');
    const historySection = document.getElementById('history-section');
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionContainer = document.getElementById('question-container');
    const quizResults = document.getElementById('quiz-results');
    const finalScoreText = document.getElementById('final-score');
    const historyContainer = document.getElementById('history-container');

    // --- 3. Setup Logic (Category & Pills) ---
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => {
                const pill = c.querySelector('.selected-pill');
                if (pill) pill.remove();
            });
            const pill = document.createElement('span');
            pill.className = 'selected-pill';
            pill.textContent = 'Selected';
            card.appendChild(pill);

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

    const paramGroups = document.querySelectorAll('.param-group');
    paramGroups.forEach(group => {
        const buttons = group.querySelectorAll('.pill-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => { b.style.opacity = '0.5'; b.style.transform = 'scale(1)'; });
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.05)';

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

    // --- 4. Start Quiz ---
    let lastRequestTime = 0;
    startQuizBtn.addEventListener('click', async () => {
        const now = Date.now();
        if (now - lastRequestTime < 5000) {
            const wait = Math.ceil((5000 - (now - lastRequestTime)) / 1000);
            alert(`Please wait ${wait} more second(s) before starting a new quiz.`);
            return;
        }
        lastRequestTime = now;

        startQuizBtn.textContent = 'Loading...';
        startQuizBtn.disabled = true;

        // Using utest proxy for the Quiz App
        const targetUrl = `https://opentdb.com/api.php?amount=${selectedAmount}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
        const workerUrl = 'https://utestproxy.kipkoechdun676.workers.dev/';
        const apiUrl = `${workerUrl}?url=${encodeURIComponent(targetUrl)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.response_code === 0 && data.results.length > 0) {
                quizQuestions = data.results;
                currentQuestionIndex = 0;
                score = 0;
                userAnswers = [];

                setupSection.style.display = 'none';
                historySection.style.display = 'none'; // Hide history during quiz
                quizSection.style.display = 'block';
                quizResults.style.display = 'none';

                renderQuestion();
            } else if (data.response_code === 5) {
                alert('Rate limit hit! Please wait a moment and try again.');
            } else {
                alert('Could not find enough questions for these settings. Try different options.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to the quiz API.');
        } finally {
            startQuizBtn.textContent = 'Start Quiz →';
            startQuizBtn.disabled = false;
        }
    });

    // --- 5. Render Question (with Navigation) ---
    function renderQuestion() {
        const q = quizQuestions[currentQuestionIndex];
        const decodeText = (str) => {
            const doc = new DOMParser().parseFromString(str, "text/html");
            return doc.documentElement.textContent;
        };

        let answers = [...q.incorrect_answers.map(decodeText), decodeText(q.correct_answer)];
        answers = answers.sort(() => Math.random() - 0.5);
        const correctAnswer = decodeText(q.correct_answer);

        questionContainer.innerHTML = `
            <h3 style="color: #d63691;">Question ${currentQuestionIndex + 1} of ${quizQuestions.length}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${decodeText(q.question)}</p>
            <div id="answers-wrapper"></div>
            <div style="display:flex; justify-content: space-between; margin-top: 20px;">
                <button id="prev-nav-btn" style="display:${currentQuestionIndex === 0 ? 'none' : 'block'}; padding: 10px 20px; cursor: pointer;">&larr; Previous</button>
                <button id="next-nav-btn" style="padding: 10px 20px; cursor: pointer;">${currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz →' : 'Next →'}</button>
            </div>
        `;

        const answersWrapper = document.getElementById('answers-wrapper');
        answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.onclick = () => checkAnswer(btn, answer, correctAnswer);
            answersWrapper.appendChild(btn);
        });

        // Re-attach navigation events
        document.getElementById('prev-nav-btn')?.addEventListener('click', goToPrevious);
        document.getElementById('next-nav-btn').addEventListener('click', goToNext);

        // If already answered, re-render the selected state
        if (userAnswers[currentQuestionIndex]) {
            restoreAnsweredState(userAnswers[currentQuestionIndex].selected, correctAnswer);
        }
    }

    // --- 6. Check Answer ---
    function checkAnswer(clickedBtn, selectedAnswer, correctAnswer) {
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.disabled = true);

        userAnswers[currentQuestionIndex] = { selected: selectedAnswer, correct: correctAnswer };

        if (selectedAnswer === correctAnswer) {
            clickedBtn.style.backgroundColor = '#a8e6cf';
            clickedBtn.style.borderColor = '#1e8449';
            score++;
        } else {
            clickedBtn.style.backgroundColor = '#ffaaa5';
            clickedBtn.style.borderColor = '#c0392b';
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.style.backgroundColor = '#a8e6cf';
                    btn.style.borderColor = '#1e8449';
                }
            });
        }
    }

    // --- 7. Restore Answered State ---
    function restoreAnsweredState(selected, correctAnswer) {
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = '#a8e6cf';
                btn.style.borderColor = '#1e8449';
            }
            if (btn.textContent === selected && selected !== correctAnswer) {
                btn.style.backgroundColor = '#ffaaa5';
                btn.style.borderColor = '#c0392b';
            }
        });
    }

    // --- 8. Navigation ---
    function goToPrevious() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    function goToNext() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }

    // --- 9. Finish Quiz ---
    function finishQuiz() {
        questionContainer.innerHTML = '';
        quizResults.style.display = 'block';

        finalScoreText.textContent = `You scored ${score} out of ${quizQuestions.length}`;

        saveHistory(score, quizQuestions.length);
        renderHistory();

        // Show home button
        if (!document.getElementById('home-btn')) {
            const home = document.createElement('button');
            home.id = 'home-btn';
            home.textContent = 'Back to Home';
            home.style.marginTop = '20px';
            home.style.padding = '10px 20px';
            home.style.cursor = 'pointer';
            home.onclick = () => {
                quizSection.style.display = 'none';
                setupSection.style.display = 'block';
                historySection.style.display = 'block'; // Show history again
                renderHistory();
            };
            quizResults.appendChild(home);
        }
    }

    // --- 10. History (Expandable) ---
    function saveHistory(score, total) {
        let history = JSON.parse(localStorage.getItem('quizHistory')) || [];

        const newRecord = {
            date: new Date().toLocaleString(),
            score: score,
            total: total,
            questions: quizQuestions.map((q, i) => ({
                question: q.question,
                correct: q.correct_answer,
                selected: userAnswers[i] ? userAnswers[i].selected : 'Not Answered'
            }))
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

            let questionsHtml = record.questions.map((q, qi) => {
                const isCorrect = q.selected === q.correct;
                const selectedColor = isCorrect ? 'green' : 'red';
                return `
                    <div style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                        <p style="margin: 5px 0;"><strong>Q${qi + 1}: ${q.question}</strong></p>
                        <p style="margin: 5px 0; font-size: 0.9rem;">Your answer: <span style="color: ${selectedColor}; font-weight: bold;">${q.selected}</span></p>
                        <p style="margin: 5px 0; font-size: 0.9rem;">Correct answer: <span style="color: green; font-weight: bold;">${q.correct}</span></p>
                    </div>
                `;
            }).join('');

            div.innerHTML = `
                <div class="history-header" style="display:flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Score: ${record.score}/${record.total}</strong>
                        <br><span style="font-size:0.8rem; color:#666;">${record.date}</span>
                    </div>
                    <div>
                        <button class="view-btn" data-index="${index}" style="cursor:pointer; padding: 5px 10px; margin-right: 5px;">View</button>
                        <button class="delete-btn" data-index="${index}" style="cursor:pointer; padding: 5px 10px; background-color: #ffaaa5; border: none; border-radius: 4px;">Delete</button>
                    </div>
                </div>
                <div class="history-detail" style="display: none; margin-top:15px;">
                    ${questionsHtml}
                </div>
            `;
            historyContainer.appendChild(div);
        });

        // Delete event
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // FIXED: Use currentTarget
                const index = e.currentTarget.getAttribute('data-index');
                let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
                history.splice(index, 1);
                localStorage.setItem('quizHistory', JSON.stringify(history));
                renderHistory();
            });
        });

        // View toggle event
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // FIXED: Use currentTarget and closest() to find the specific detail div
                const detailDiv = e.currentTarget.closest('.history-item').querySelector('.history-detail');
                if (detailDiv.style.display === 'none') {
                    detailDiv.style.display = 'block';
                    e.currentTarget.textContent = 'Hide';
                } else {
                    detailDiv.style.display = 'none';
                    e.currentTarget.textContent = 'View';
                }
            });
        });
    }

    // Initialize History on page load
    renderHistory();
    historySection.style.display = 'block';
     setupSection.style.display = 'block';
});