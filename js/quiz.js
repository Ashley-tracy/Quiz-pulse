import { fetchQuizQuestions } from './api.js';
import { state, resetQuizProgress, getHistory, saveHistory, deleteHistoryItem } from './state.js';
import { decodeText, shuffleArray } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const setupSection = document.getElementById('setup-section');
    const quizSection = document.getElementById('quiz-section');
    const historySection = document.getElementById('history-section');

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionContainer = document.getElementById('question-container');
    const quizResults = document.getElementById('quiz-results');
    const finalScoreText = document.getElementById('final-score');
    const historyContainer = document.getElementById('history-container');

    // --- Setup Category Listeners ---
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
            if (title.includes('General')) state.selectedCategory = '9';
            else if (title.includes('Computers')) state.selectedCategory = '18';
            else if (title.includes('Science')) state.selectedCategory = '17';
            else if (title.includes('History')) state.selectedCategory = '23';
            else if (title.includes('Geography')) state.selectedCategory = '22';
            else if (title.includes('Films')) state.selectedCategory = '11';
            else if (title.includes('Music')) state.selectedCategory = '12';
            else if (title.includes('Sports')) state.selectedCategory = '21';
        });
    });

    //Setup Option Listeners
    const paramGroups = document.querySelectorAll('.param-group');
    paramGroups.forEach(group => {
        const buttons = group.querySelectorAll('.pill-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => { b.style.opacity = '0.5'; b.style.transform = 'scale(1)'; });
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.05)';

                const text = btn.textContent.trim();
                if (text === 'Easy') state.selectedDifficulty = 'easy';
                else if (text === 'Medium') state.selectedDifficulty = 'medium';
                else if (text === 'Hard') state.selectedDifficulty = 'hard';
                else if (text === 'Any Difficulty') state.selectedDifficulty = '';

                if (text === '5 Questions') state.selectedAmount = '5';
                else if (text === '10 Questions') state.selectedAmount = '10';
                else if (text === '15 Questions') state.selectedAmount = '15';
            });
        });
    });

    //Start Quiz Action 
    startQuizBtn.addEventListener('click', async () => {
        const now = Date.now();
        if (now - state.lastRequestTime < 5000) {
            const wait = Math.ceil((5000 - (now - state.lastRequestTime)) / 1000);
            alert(`Please wait ${wait} more second(s) before starting a new quiz.`);
            return;
        }
        state.lastRequestTime = now;

        startQuizBtn.textContent = 'Loading...';
        startQuizBtn.disabled = true;

        try {
            const data = await fetchQuizQuestions(state.selectedAmount, state.selectedCategory, state.selectedDifficulty);

            if (data.response_code === 0 && data.results.length > 0) {
                state.quizQuestions = data.results;
                resetQuizProgress();

                setupSection.style.display = 'none';
                historySection.style.display = 'none';
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

    // Render Question 
    function renderQuestion() {
        const q = state.quizQuestions[state.currentQuestionIndex];
        const rawAnswers = [...q.incorrect_answers.map(decodeText), decodeText(q.correct_answer)];
        const answers = shuffleArray(rawAnswers);
        const correctAnswer = decodeText(q.correct_answer);

        const isLastQuestion = state.currentQuestionIndex === state.quizQuestions.length - 1;

        questionContainer.innerHTML = `
            <h3 style="color: #d63691;">Question ${state.currentQuestionIndex + 1} of ${state.quizQuestions.length}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${decodeText(q.question)}</p>
            <div id="answers-wrapper"></div>
            <div style="display:flex; justify-content: space-between; margin-top: 20px;">
                <button id="prev-nav-btn" style="display:${state.currentQuestionIndex === 0 ? 'none' : 'block'}; padding: 10px 20px; cursor: pointer;">&larr; Previous</button>
                <button id="next-nav-btn" style="padding: 10px 20px; cursor: pointer;">${isLastQuestion ? 'Finish Quiz →' : 'Next →'}</button>
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

        document.getElementById('prev-nav-btn')?.addEventListener('click', goToPrevious);
        document.getElementById('next-nav-btn').addEventListener('click', goToNext);

        if (state.userAnswers[state.currentQuestionIndex]) {
            restoreAnsweredState(state.userAnswers[state.currentQuestionIndex].selected, correctAnswer);
        }
    }

    //  Check Answer 
    function checkAnswer(clickedBtn, selectedAnswer, correctAnswer) {
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.disabled = true);

        state.userAnswers[state.currentQuestionIndex] = { selected: selectedAnswer, correct: correctAnswer };

        if (selectedAnswer === correctAnswer) {
            clickedBtn.style.backgroundColor = '#a8e6cf';
            clickedBtn.style.borderColor = '#1e8449';
            state.score++;
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

    //  Restore Answered State 
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

    // Navigation Handling
    function goToPrevious() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    }

    function goToNext() {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex < state.quizQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }

    // Finish Quiz 
    function finishQuiz() {
        questionContainer.innerHTML = '';
        quizResults.style.display = 'block';

        finalScoreText.textContent = `You scored ${state.score} out of ${state.quizQuestions.length}`;

        saveHistory(state.score, state.quizQuestions.length, state.quizQuestions, state.userAnswers);
        renderHistory();

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
                historySection.style.display = 'block';
                renderHistory();
            };
            quizResults.appendChild(home);
        }
    }

    // History Renderer 
    function renderHistory() {
        const history = getHistory();
        historyContainer.innerHTML = '';

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No quizzes taken yet.</p>';
            return;
        }

        history.forEach((record, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';

            const questionsHtml = record.questions.map((q, qi) => {
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

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                deleteHistoryItem(index);
                renderHistory();
            });
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
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

    // Initial Loading
    renderHistory();
    historySection.style.display = 'block';
    setupSection.style.display = 'block';
});