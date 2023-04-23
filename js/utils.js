/**
 * Split a sentence into words, punctuation, and whitespaces
 *
 * Explanation: Use String#match method with regex /\w+|\s+|[^\s\w]+/g.
 *  - \w+ - for any word match
 *  - \s+ - for whitespace
 *  - [^\s\w]+ - for matching combination of anything other than whitespace and
 *    word character.
 * @param {string} sentence String to translate
 * @return {Array<string>}  Array of strings (splitted string)
 *
 */
export function splitSentence(sentence) {
	const splitted = sentence.match(/\w+|\s+|[^\s\w]+/g);
	return splitted;
}

/**
 * Returns true if the input is a word, false if it is a space or punctuation,
 * same logic used in the splitSentence function
 * @param {*} word
 */
export function isSpecialChar(word) {
	const matchingSpecialChars = word.match(/\s+|[^\s\w]+/g);
	return (matchingSpecialChars != null);
}

export function capitalizeWord(word) {
	return word.charAt(0).toUpperCase()
		+ word.slice(1).toLowerCase();
}

export function showElement(elemendId) {
	document.getElementById(elemendId).classList.remove('d-none');
}

export function hideElement(elemendId) {
	document.getElementById(elemendId).classList.remove('d-none');
}
