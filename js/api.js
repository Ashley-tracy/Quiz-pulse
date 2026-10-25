const WORKER_URL = 'https://utestproxy.kipkoechdun676.workers.dev/';

/**
 * Fetches questions from OpenTDB via Cloudflare worker proxy.
 * @param {string|number} amount 
 * @param {string} category 
 * @param {string} difficulty 
 * @returns {Promise<Object>} JSON response object
 */
export async function fetchQuizQuestions(amount, category, difficulty) {
    const targetUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const apiUrl = `${WORKER_URL}?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}