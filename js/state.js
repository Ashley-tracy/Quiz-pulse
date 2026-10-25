export const state = {
    selectedCategory: '9',
    selectedDifficulty: '',
    selectedAmount: '5',
    quizQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [],
    lastRequestTime: 0
};

export function resetQuizProgress() {
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.userAnswers = [];
}

export function getHistory() {
    return JSON.parse(localStorage.getItem('quizHistory')) || [];
}

export function saveHistory(score, total, quizQuestions, userAnswers) {
    const history = getHistory();

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

export function deleteHistoryItem(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem('quizHistory', JSON.stringify(history));
}