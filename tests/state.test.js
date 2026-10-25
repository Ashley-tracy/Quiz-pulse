// tests/state.test.js

// Mock localStorage before importing state.js
const store = {};
globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
};

const {
    state,
    resetQuizProgress,
    getHistory,
    saveHistory,
    deleteHistoryItem
} = await import('../js/state.js');

let passed = 0, failed = 0;
const assert = (name, cond) => {
    if (cond) { console.log(`✅ ${name}`); passed++; }
    else { console.error(`❌ ${name}`); failed++; }
};

// getHistory — empty
localStorage.clear();
assert('getHistory returns [] when empty', Array.isArray(getHistory()) && getHistory().length === 0);

// getHistory — after save
const mockQuestions = [
    { question: 'Q1', correct_answer: 'A' },
    { question: 'Q2', correct_answer: 'B' }
];
const mockAnswers = [
    { selected: 'A' },
    { selected: 'Wrong' }
];
localStorage.clear();
saveHistory(1, 2, mockQuestions, mockAnswers);
const afterSave = getHistory();
assert('saveHistory adds one record', afterSave.length === 1);
assert('record stores score', afterSave[0].score === 1);
assert('record stores total', afterSave[0].total === 2);
assert('record stores per-question detail', afterSave[0].questions.length === 2);
assert('records selected answer', afterSave[0].questions[0].selected === 'A');
assert('records correct answer', afterSave[0].questions[1].correct === 'B');

// cap at 10
localStorage.clear();
for (let i = 0; i < 15; i++) {
    saveHistory(i, 10, mockQuestions, mockAnswers);
}
assert('saveHistory caps at 10', getHistory().length === 10);
assert('newest record is first', getHistory()[0].score === 14);

// deleteHistoryItem
localStorage.clear();
saveHistory(1, 2, mockQuestions, mockAnswers);
saveHistory(2, 2, mockQuestions, mockAnswers);
assert('two records before delete', getHistory().length === 2);
deleteHistoryItem(0);
assert('one record after delete', getHistory().length === 1);
assert('deleted the right one', getHistory()[0].score === 1);

// resetQuizProgress
state.currentQuestionIndex = 5;
state.score = 3;
state.userAnswers = [{ selected: 'A' }];
resetQuizProgress();
assert('reset currentQuestionIndex', state.currentQuestionIndex === 0);
assert('reset score', state.score === 0);
assert('reset userAnswers', state.userAnswers.length === 0);

console.log(`\n🧪 state.test.js — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);