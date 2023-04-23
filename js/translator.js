/**
 *  Core functions to translate a sentence in riocontra.
 */

import {
	splitSentence, isSpecialChar, capitalizeWord, removeDoubleLetters, doesItSoundBad,
} from './utils.js';
import { isVowel, divide } from './syllabator.js';
import LCG from './lcg.js';

export default class Translator {
	constructor(
		percentage,
		nezioTechnique,
		erreMossa,
		erreMossaToAllConsonants,
		supertofePercentage,
		randomSeed,
	) {
		console.log(
			`Instantating Translator: \n \
        - percentage -> ${percentage} \n \
        - nezioTechnique -> ${nezioTechnique} \n \
        - erreMossa -> ${erreMossa} \n \
        - erreMossaToAllConsonants -> ${erreMossaToAllConsonants} \n \
        - supertofePercentage -> ${supertofePercentage} \n \
        - randomSeed -> ${randomSeed} \n `,
		);

		if ((percentage == undefined) || (percentage < 0) || (percentage > 100)
		) {
			throw new Error('Please define a percentage between 0 and 100');
		} else {
			this.percentage = percentage;
		}

		if (nezioTechnique == undefined) {
			this.nezioTechnique = true;
		} else if (typeof (nezioTechnique) == 'boolean') {
			this.nezioTechnique = nezioTechnique;
		} else {
			throw Error(`nezioTechnique should be a boolean. Got ${nezioTechnique}`);
		}

		if (erreMossa == undefined) {
			this.erreMossa = true;
		} else if (typeof (erreMossa) == 'boolean') {
			this.erreMossa = erreMossa;
		} else {
			throw new Error(`erreMossa should be a boolean. Got ${erreMossa}`);
		}

		if (erreMossaToAllConsonants == undefined) {
			this.erreMossaToAllConsonants = false;
		} else if (typeof (erreMossaToAllConsonants) == 'boolean') {
			this.erreMossaToAllConsonants = erreMossaToAllConsonants;
		} else {
			throw new Error(`erreMossaToAllConsonants should be a boolean. Got ${
				erreMossaToAllConsonants}`);
		}

		if ((supertofePercentage == undefined) || (supertofePercentage < 0) || (supertofePercentage > 100)
		) {
			throw new Error(`Please define a percentage between 0 and 100. Got ${supertofePercentage}`);
		} else {
			this.supertofePercentage = supertofePercentage;
		}

		this.customRandomGenerator = null;
		if ((randomSeed != undefined) && (randomSeed != '')) {
			try {
				this.customRandomGenerator = new LCG(randomSeed);
			} catch (error) {
				console.log(`Error instantiating LCG (I will use the JS default). \
                    Error: ${error}`);
			}
		}
	}

	translateSentence(sentence) {
		console.log('Input sentence: ', sentence);
		const splitted = splitSentence(sentence);
		console.log('Splitted in words: ', splitted);
		// Loop over splitted sentence, translate each word and recompose the
		// translated sentence
		const translations = [];
		for (let i = 0; i < splitted.length; i += 1) {
			const word = splitted[i];
			if (isSpecialChar(word)) {
				// Just add it to the sentence
				translations.push(word);
				// } else if (word.charAt(0) == word.charAt(0).toUpperCase() && i!=0) {
				//     // Do not translate a word that is capitalized, except if it is
				//     // the first one
				//     translations.push(word);
			} else {
				// Translate this word only if the next one is not <'>,
				// otherwise articles will be translated (eg 'dell')

				// Get next word (if not at the end)
				let next = 'dummy';
				if (i < splitted.length - 1) {
					next = splitted[i + 1];
				}

				// Check and translate if needed
				if (next == "'") {
					translations.push(word);
				} else {
					let translated = this.translateWord(word);
					if (word.charAt(0) == word.charAt(0).toUpperCase()) {
						// Capitalize if the original was capitalized
						translated = capitalizeWord(translated);
					}
					// Add translated word to translations
					translations.push(translated);
				}
			}
		}

		// Capitalize first word
		if (translations.length > 0) {
			translations[0] = capitalizeWord(translations[0]);
		}

		return translations.reduce((a, b) => a + b, '');
	}

	translateWord(word) {
		if (isSpecialChar(word)) throw new Error(`Cannot translate a special character:${word}`);

		// todo: search for seba words. EG:
		// translation = search_basic_translation(word)
		// if translation is not None:
		//     return translation

		// Return if the string is too short
		if (word.length <= 3) {
			// TODO: zio, zia should be in basic translation above
			if (word == 'zio') {
				return 'ozi';
			} if (word == 'zia') {
				return 'iza';
			}
			return word;
		}

		// Check the zione technique
		if (word.length > 5 && word.slice(-5, -1) == 'zion') {
			if (this.nezioTechnique) {
				if (word[-6] == 'n') return `${word.slice(0, -6)}nezio`;
				return `${word.slice(0, -5)}nezio`;
			}
			// return normal world
			return word;
		}

		// At this point, we can apply the real riocontra!
		const translate = this.getBernoullyOutcome(this.percentage / 100);
		if (translate) { // We do not translate all the words
			const syllabs = divide(word);
			const translatedWord = this.getRiocontraFromSyllabs(syllabs);
			if (this.translateWord == null) {
				return word;
			}

			// If nothing worked, we do not translate
			return translatedWord;
		}
		return word;
	}

	getRiocontraFromSyllabs(syllabs) {
		console.log('Get riocontra from syllabs: ', syllabs);
		let invertedSyllabs;
		const nSyllabs = syllabs.length;

		if (nSyllabs <= 3) {
			invertedSyllabs = this.basicInversion(syllabs);
		} else if (nSyllabs == 4) {
			invertedSyllabs = this.invertFourSyllabsWithSupertofe(syllabs);
		} else if (nSyllabs > 4) {
			invertedSyllabs = this.invertMoreThanFourSyllabsWithSupertofe(syllabs);
		} else {
			invertedSyllabs = syllabs;
		}

		// Sum inverted syllabs to form the word
		console.log(`Inverted: ${invertedSyllabs}`);
		const wordFromSyllabs = invertedSyllabs.reduce((a, b) => a + b, '');
		return wordFromSyllabs;
	}

	// Divide the word in two chunks and inverts them, applying some easy rules.
	// It also checks if impertofe needs to be applied
	basicInversion(inputSyllabs) {
		const syllabs = inputSyllabs;
		console.log(`Basic inversion of ${syllabs}`);
		const originalSyllabs = syllabs.slice();
		const nSyllabs = syllabs.length;

		// Declare first chunck and second chunck, they will be inverted
		let firstChunk;
		let secondChunk;

		// Needed when we apply impertofe. There we do not check if we
		// need to remove doubles
		let skipDoublesRemoval = false;

		if (nSyllabs == 1) {
			// Nothing to do
			return syllabs;
		} if (nSyllabs == 2) {
			const firstLetter = syllabs[0][0];
			const lastLetter = syllabs.slice(-1)[0].slice(-1)[0];
			if (isVowel(firstLetter) && isVowel(lastLetter)) {
				// 2 syllab words starting and ending with a vowel cannot be
				// inverted, they sonund bad
				return syllabs;
			}
			[firstChunk, secondChunk] = syllabs;
		} else {
			const firstLetter = syllabs[0][0];
			const lastLetter = syllabs.slice(-1)[0].slice(-1)[0];
			if (isVowel(firstLetter) && isVowel(lastLetter)) {
				console.log('Impertofe needed');
				// We cannot invert, but we can apply impertofe (invert the
				// second chunck)
				const tempSecondChunk = syllabs.slice(1);
				// Before inverting: remove a double letter between first and
				// second chunk
				const lastLetterFirstChunk = syllabs[0].slice(-1)[0];
				const firstLetterSecondChunck = tempSecondChunk[0][0];
				if (lastLetterFirstChunk == firstLetterSecondChunck) {
					syllabs[0] = syllabs[0].slice(0, -1);
				}
				// Invert the second chunck
				const inverted = this.basicInversion(tempSecondChunk);
				// Two dirty tricks are now needed:
				//  - Skip the doubles removal
				//  - Define FLIPPED first and second chunks (the first syllab
				//    has to be again the first one at the end)
				skipDoublesRemoval = true;
				[secondChunk] = syllabs;
				firstChunk = inverted.reduce((a, b) => a + b, '');
			} else {
				// Two ways of defining the second chunck, equally valid. We
				// take one of them with 50% chance
				const translate = this.getBernoullyOutcome(0.5);
				if (translate) {
					firstChunk = syllabs.slice(0, -1).reduce((a, b) => a + b, '');
					secondChunk = syllabs.slice(-1).reduce((a, b) => a + b, '');
					console.log(`First case ${firstChunk},${secondChunk}`);
				} else {
					firstChunk = syllabs.slice(0, -2).reduce((a, b) => a + b, '');
					secondChunk = syllabs.slice(-2).reduce((a, b) => a + b, '');
					console.log(`Second case ${firstChunk},${secondChunk}`);
				}
			}
		}

		// Define combined chunks (not yet inverted)
		let chunks = [firstChunk, secondChunk];
		console.log(`First and second chunks ${chunks}`);

		// Remove doubles from the original world
		if (!skipDoublesRemoval) {
			chunks = removeDoubleLetters(chunks);
			console.log(`Doubles removed ${chunks}`);
		}

		// Finally: THE INVERSION
		let invertedChunks = chunks.reverse();
		console.log(`InvertedChunks ${invertedChunks}`);

		// We need to remove doubles once again
		if (!skipDoublesRemoval) {
			invertedChunks = removeDoubleLetters(invertedChunks);
			console.log(`Doubles removed ${chunks}`);
		}

		// Check if the syllabs are the same, in this case return the original
		// ones (this fixes some corner cases)
		if (invertedChunks[0] == invertedChunks[1]) {
			return originalSyllabs;
		}

		// Erremossa technique
		if ((this.erreMossa) || (this.erreMossaToAllConsonants)) {
			const lastInvChunk = invertedChunks.slice(-1)[0];
			const lastLetter = lastInvChunk.slice(-1)[0];
			const needToApplyErreMossa = ((this.erreMossa) && (lastLetter == 'r'))
                || ((this.erreMossaToAllConsonants) && !(isVowel(lastLetter)));
			if (needToApplyErreMossa) {
				invertedChunks = [invertedChunks[0], lastLetter, lastInvChunk.slice(0, -1)];
			}
		}

		// Check if we can pronounce the final outcome
		if (doesItSoundBad(invertedChunks)) {
			return originalSyllabs;
		}
		console.log(`Returning ${invertedChunks} from ${originalSyllabs}`);
		return invertedChunks;
	}

	invertFourSyllabsWithSupertofe(syllabs) {
		const translate = this.getBernoullyOutcome(this.supertofePercentage / 100);
		// If supertofe is on, apply it only sometimes
		if (translate) {
			// Supertofe: invert first two, invert last two and then concatenate
			const firstInverted = this.basicInversion(syllabs.slice(0, 2));
			const lastInverted = this.basicInversion(syllabs.slice(-2));
			const invertedSyllabs = firstInverted.concat(lastInverted);
			// Check if we can pronounce it
			if (doesItSoundBad(invertedSyllabs)) {
				return syllabs;
			}
			return invertedSyllabs;
		}
		// No supertofe, just cesempli
		const toInvert = [syllabs.slice(0, -1).reduce((a, b) => a + b, ''), syllabs.pop()];
		return this.basicInversion(toInvert);
	}

	invertMoreThanFourSyllabsWithSupertofe(syllabs) {
		if (syllabs.length < 5) {
			throw new Error(`Apply only on words with at least 5 syllabs. Got ${syllabs}`);
		}

		const translate = this.getBernoullyOutcome(this.supertofePercentage / 100);

		if (translate) {
			// This is a advanced supertofe technique
			const firstInverted = this.basicInversion(syllabs.slice(0, 2));
			const lastInverted = this.basicInversion(syllabs.slice(-3));
			const invertedSyllabs = firstInverted
				.concat(syllabs.slice(2, syllabs.length - 3))
				.concat(lastInverted);
			// Check if we can pronounce it
			if (doesItSoundBad(invertedSyllabs)) {
				return syllabs;
			}
			return invertedSyllabs;
		}
		// No supertofe, just cesempli
		const toInvert = [syllabs.slice(0, -1).reduce((a, b) => a + b, ''), syllabs.pop()];
		return this.basicInversion(toInvert);
	}

	// Aux function: return True or False following a Bernoully distribution
	getBernoullyOutcome(p) {
		if ((p < 0) || (p > 1)) {
			throw new Error(`Got p (${p}) not in [0, 1].`);
		}

		let u;

		if (this.customRandomGenerator == null) {
			u = Math.random();
		} else {
			u = this.customRandomGenerator.getUniform();
		}

		if (u < p) {
			return true;
		}
		return false;
	}
}
