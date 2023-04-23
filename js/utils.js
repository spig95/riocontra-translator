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

export function removeDoubleLetters(originalSyllabs) {
	const syllabs = originalSyllabs;
	for (let i = 0; i < syllabs.length - 1; i += 1) {
		const prev = syllabs[i];
		const succ = syllabs[i + 1];
		if (prev.slice(-1)[0] == succ[0]) {
			syllabs[i] = prev.slice(0, -1);
		}
	}
	return syllabs;
}

const badPairs = ['gc', 'cg', 'mc', 'cm', 'sn'];

export function doesItSoundBad(syllabs) {
	// Check if the syllabs, when merged into a word, generate two letters
	// that are in badPairs
	for (let i = 0; i < syllabs.length - 1; i += 1) {
		const curr = syllabs[i];
		const lastLetterCurr = curr.slice(-1)[0];
		const next = syllabs[i + 1];
		const firstLetterNext = next[0];
		if (badPairs.includes(lastLetterCurr + firstLetterNext)) {
			return true;
		}
	}
	return false;
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
