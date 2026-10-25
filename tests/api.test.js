// tests/api.test.js

let lastFetchUrl = null;
let mockOk = true;
let mockStatus = 200;
let mockJson = { response_code: 0, results: [] };

globalThis.fetch = async (url) => {
    lastFetchUrl = url;
    return {
        ok: mockOk,
        status: mockStatus,
        json: async () => mockJson
    };
};

const { fetchQuizQuestions } = await import('../js/api.js');

let passed = 0, failed = 0;
const assert = (name, cond) => {
    if (cond) { console.log(`✅ ${name}`); passed++; }
    else { console.error(`❌ ${name}`); failed++; }
};

// Success case
mockOk = true; mockStatus = 200;
mockJson = { response_code: 0, results: [{ question: 'Q1' }] };
let result = await fetchQuizQuestions(5, '9', '');
assert('returns parsed JSON on success', result.response_code === 0);
assert('returns results array', Array.isArray(result.results));

// URL construction
assert('calls the worker URL', lastFetchUrl.startsWith('https://utestproxy.kipkoechdun676.workers.dev/?url='));
assert(
    'encodes OpenTDB target URL',
    lastFetchUrl.includes(encodeURIComponent('https://opentdb.com/api.php?amount=5&category=9&difficulty=&type=multiple'))
);

// Failure case — non-ok response
mockOk = false; mockStatus = 500;
let threw = false;
let errMessage = '';
try {
    await fetchQuizQuestions(5, '9', '');
} catch (e) {
    threw = true;
    errMessage = e.message;
}
assert('throws on non-ok status', threw);
assert('error message includes status', errMessage.includes('500'));

console.log(`\n🧪 api.test.js — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);