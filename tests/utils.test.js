// tests/utils.test.js

globalThis.DOMParser = class {
    parseFromString(str) {
        const decoded = str
            .replace(/&quot;/g, '"')
            .replace(/&#0?39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        return { documentElement: { textContent: decoded } };
    }
};

const { decodeText, shuffleArray } = await import('../js/utils.js');

let passed = 0, failed = 0;
const assert = (name, cond) => {
    if (cond) { console.log(`✅ ${name}`); passed++; }
    else { console.error(`❌ ${name}`); failed++; }
};

assert('decodeText decodes &quot;', decodeText('say &quot;hi&quot;') === 'say "hi"');
assert('decodeText decodes &#039;', decodeText("it&#039;s") === "it's");
assert('decodeText leaves plain text', decodeText('hello') === 'hello');
assert('decodeText handles &amp;', decodeText('a &amp; b') === 'a & b');

const input = [1, 2, 3, 4, 5];
const copy = [...input];
const out = shuffleArray(input);
assert('shuffleArray returns same length', out.length === input.length);
assert('shuffleArray keeps all elements', [...out].sort().join() === [...input].sort().join());
assert('shuffleArray does not mutate input', input.join() === copy.join());

console.log(`\n🧪 utils.test.js — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);