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
    let splitted = sentence.match(/\w+|\s+|[^\s\w]+/g);
    return splitted
};


/**
 * Returns true if the input is a word, false if it is a space or punctuation,
 * same logic used in the splitSentence function
 * @param {*} word 
 */
export function isSpecialChar(word) {
    let matchingSpecialChars = word.match(/\s+|[^\s\w]+/g);
    if (matchingSpecialChars === null)
        return false
    else
        return true
};