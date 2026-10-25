/**
 * Decodes HTML entities in a string.
 * @param {string} str - HTML encoded string
 * @returns {string} Decoded plain text
 */
export function decodeText(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
}

/**
 * Returns a new array with items shuffled in random order.
 * @param {Array} array 
 * @returns {Array}
 */
export function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}