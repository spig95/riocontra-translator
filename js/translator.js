/**
 *  Core functions to translate a sentence in riocontra.
 */

import { splitSentence, isSpecialChar } from './utils.js'
import { isVowel, divide } from './syllabator.js'

var bad_pairs = ["gc", "cg", "mc", "cm", "sn"]


export class Translator {
    constructor(
        percentage,
        nezioTechnique,
        erreMossa,
        erreMossaToAllConsonants,
        supertofePercentage) {
        
        if ((percentage == undefined) || (percentage < 0) || (percentage > 100)
        ) {
            throw "Please define a percentage between 0 and 100";
        } else {
            this.percentage = percentage;
        }

        if (nezioTechnique == undefined) {
            this.nezioTechnique = true
        } else if (typeof(nezioTechnique) === "boolean") {
            this.nezioTechnique = nezioTechnique
        } else {
            throw "nezioTechnique should be a boolean. Got " + nezioTechnique;
        }

        if (erreMossa == undefined) {
            this.erreMossa = true
        } else if (typeof(erreMossa) === "boolean") {
            this.erreMossa = erreMossa
        } else {
            throw "erreMossa should be a boolean. Got " + erreMossa;
        }

        if (erreMossaToAllConsonants == undefined) {
        this.erreMossaToAllConsonants = false
        } else if (typeof(erreMossaToAllConsonants) === "boolean") {
            this.erreMossaToAllConsonants = erreMossaToAllConsonants
        } else {
            throw "erreMossaToAllConsonants should be a boolean. Got " +  
                erreMossaToAllConsonants;
        }
        
        if ((supertofePercentage == undefined) || (supertofePercentage < 0) || (supertofePercentage > 100)
        ) {
            throw "Please define a percentage between 0 and 100. Got " + supertofePercentage;
        } else {
            this.supertofePercentage = supertofePercentage;
        }

    };

    translateSentence (sentence) {
        console.log("input sentence: ", sentence);
        let splitted = splitSentence(sentence);
        console.log("splitted: ", splitted);
        // Loop over splitted sentence, translate each word and recompose the 
        // translated sentence
        let translatedSentence = "";
        for (let i = 0; i < splitted.length; i++) {
            let word = splitted[i];
            if (isSpecialChar(word)) {
                // Just add it to the sentence
                translatedSentence += word;
            } else if (i === 0) {
                // Handle capital letter
                let translatedWord = this.translateWord(word)
                let capitalizedTranslation = 
                    translatedWord.charAt(0).toUpperCase() +
                    translatedWord.slice(1).toLowerCase();
                translatedSentence += capitalizedTranslation;
            } else if (word.charAt(0) == word.charAt(0).toUpperCase()) {
                // Do not translate a word that is capitalized
                return word;
            } else {
                // Just translate and add to sentence
                translatedSentence += this.translateWord(word);
            };
        };

        return translatedSentence;
    };

    translateWord (word) {
        if (isSpecialChar(word))
            throw "Cannot translate a special character:" + word;
        
        // todo: search for seba words. EG:
        // translation = search_basic_translation(word)
        // if translation is not None:
        //     return translation

        // Return if the string is too short
        if (word.length <= 3) {
            // TODO: zio, zia should be in basic translation above
            if (word === "zio"){
                return "ozi";
            } else if (word === "zia") {
                return "iza";
            } else {
                return word;
            }
        }
            

        // Check the zione technique
        if (word.length > 5 && word.slice(-5, -1) == 'zion') {
            if (this.nezioTechnique) {
                if (word[-6] === "n")
                    return word.slice(0, -6) + "nezio";
                else
                    return word.slice(0, -5) + "nezio";
            } else {
                // return normal world
                return word
            }
        };

        // At this point, we can apply the real riocontra!
        let u = Math.random();
        if (100 * u < this.percentage) { // We do not translate all the words
            let syllabs = divide(word)
            let translatedWord = this.getRiocontraFromSyllabs(syllabs)
            if (this.translateWord === null) {
                return word
            }
            else {
                // If nothing worked, we do not translate
                return translatedWord;
            }
        } else {
            return word
        }

    };

    getRiocontraFromSyllabs (syllabs) { 
        console.log("Get riocontra from syllabs: ", syllabs)
        let invertedSyllabs;
        let n_syllabs = syllabs.length;

        if (n_syllabs <= 3) {
            invertedSyllabs = this.basicInversion(syllabs);
        } else if (n_syllabs === 4) {
            invertedSyllabs = this.invertFourSyllabs(syllabs);
        } else if (n_syllabs > 4) {
            invertedSyllabs = this.invertLongWords(syllabs);
        } else {
            invertedSyllabs = syllabs;
        }

        // Sum inverted syllabs to form the word
        console.log(invertedSyllabs);
        let wordFromSyllabs = invertedSyllabs.reduce((a, b) => a + b, "");
        return wordFromSyllabs;
    };

    // Divid the word in two chunks and inverts them, applying some easy rules.
    // It also checks if impertofe needs to be applied
    basicInversion (syllabs) {
        console.log("Basic inversion of " + syllabs);
        let originalSyllabs = syllabs.slice();
        let n_syllabs = syllabs.length;

        // Declare first chunck and second chunck, they will be inverted
        let firstChunk;
        let secondChunk;

        // Needed when we apply impertofe. There we do not check if we 
        // need to remove doubles
        let skipDoublesRemoval = false;

        if (n_syllabs == 1) {
            // Nothing to do
            return syllabs;
        } else if (n_syllabs == 2) {
            let firstLetter = syllabs[0][0];
            let lastLetter = syllabs.slice(-1)[0].slice(-1)[0];
            if (isVowel(firstLetter) && isVowel(lastLetter)) {
                // 2 syllab words starting and ending with a vowel cannot be 
                // inverted, they sonund bad
                return syllabs;
            } else {
                firstChunk = syllabs[0];
                secondChunk = syllabs[1];
            }
        } else {
            let firstLetter = syllabs[0][0];
            let lastLetter = syllabs.slice(-1)[0].slice(-1)[0];
            if (isVowel(firstLetter) && isVowel(lastLetter)) {
                console.log("Impertofe needed");
                // We cannot invert, but we can apply impertofe (invert the 
                // second chunck)
                let tempSecondChunk = syllabs.slice(1);
                // Before inverting: remove a double letter between first and 
                // second chunk
                let lastLetterFirstChunk = syllabs[0].slice(-1)[0];
                let firstLetterSecondChunck = tempSecondChunk[0][0]
                if (lastLetterFirstChunk == firstLetterSecondChunck) {
                    syllabs[0] = syllabs[0].slice(0, -1)
                }
                // Invert the second chunck
                let inverted = this.basicInversion(tempSecondChunk);
                // Two dirty tricks are now needed:
                //  - Skip the doubles removal
                //  - Define FLIPPED first and second chunks (the first syllab
                //    has to be again the first one at the end)
                skipDoublesRemoval = true
                secondChunk = syllabs[0];
                firstChunk = inverted.reduce((a, b) => a + b, "");
            } else {
                // Two ways of defining the second chunck, equally valid. We
                // take one of them with 50% chance
                let u = Math.random();
                if (u < 0.5) {
                    firstChunk = syllabs.slice(0, -1).reduce((a, b) => a + b, "");
                    secondChunk = syllabs.slice(-1).reduce((a, b) => a + b, "");
                    console.log("First case " + firstChunk + "," + secondChunk)
                } else {
                    firstChunk = syllabs.slice(0, -2).reduce((a, b) => a + b, "");
                    secondChunk = syllabs.slice(-2).reduce((a, b) => a + b, "");
                    console.log("Second case " + firstChunk + "," + secondChunk)
                }
            }
        };

        // Define combined chunks (not yet inverted)
        let chunks = new Array(firstChunk, secondChunk);
        console.log("First and second chunks " + chunks)

        // Remove doubles from the original world
        if (!skipDoublesRemoval) {
            chunks = this.removeDoubleLetters(chunks);
            console.log("Doubles removed " + chunks);
        }

        // Finally: THE INVERSION
        let invertedChunks = chunks.reverse();
        console.log("invertedChunks " + invertedChunks)

        // We need to remove doubles once again
        if (!skipDoublesRemoval) {
            invertedChunks = this.removeDoubleLetters(invertedChunks);
            console.log("Doubles removed " + chunks)
        };
    
        // Check if the syllabs are the same, in this case return the original 
        // ones (this fixes some corner cases)
        if (invertedChunks[0] === invertedChunks[1]) {
            return originalSyllabs;
        }

        // Erremossa technique
        if ((this.erreMossa) | (this.erreMossaToAllConsonants)) {
            let lastInvChunk = invertedChunks.slice(-1)[0]
            let lastLetter = lastInvChunk.slice(-1)[0]
            if (
                ((this.erreMossa) & (lastLetter === "r")) |
                ((this.erreMossaToAllConsonants) & !(isVowel(lastLetter)))
                ) {
                    invertedChunks = [
                        invertedChunks[0], lastLetter, lastInvChunk.slice(0, -1)
                    ];
                }
        } 

        // Check if we can pronounce the final outcome
        if (this.doesItSoundBad(invertedChunks)) {
            return originalSyllabs;
        } else {
            console.log("Returning " + invertedChunks)
            return invertedChunks;
        }

    };

    invertFourSyllabs (syllabs) {
        let u = Math.random()
        // If supertofe is on, apply it only sometimes
        if (100 * u < this.supertofePercentage) {
            // Supertofe: invert first two, invert last two and then concatenate
            let firstInverted = this.basicInversion(syllabs.slice(0, 2));
            let lastInverted = this.basicInversion(syllabs.slice(-2));
            let invertedSyllabs = firstInverted.concat(lastInverted);
            // Check if we can pronounce it
            if (this.doesItSoundBad(invertedSyllabs)) {
                return syllabs;
            } else {
                return invertedSyllabs;
            }
        } else {
            return this.basicInversion(
                new Array (
                    syllabs.slice(0, -1).reduce((a, b) => a + b, ""),
                    syllabs.pop()  //Last elem
            ));
        }
    };

    invertLongWords (syllabs) {
        if (syllabs.length < 5) {
            throw "Apply only on words with at least 5 syllabs. Got " + syllabs
        }

        let u = Math.random();
        // If supertofe is on, apply it only sometimes
        console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee " + u + this.supertofePercentage)
        if (100 * u < this.supertofePercentage) {
            // This is a advanced supertofe technique
            let firstInverted = this.basicInversion(syllabs.slice(0, 2))
            let lastInverted = this.basicInversion(syllabs.slice(-3))
            let invertedSyllabs = 
                firstInverted
                .concat(syllabs.slice(2, syllabs.length - 3))
                .concat(lastInverted)
            // Check if we can pronounce it
            if (this.doesItSoundBad(invertedSyllabs)) {
                return syllabs;
            } else {
                return invertedSyllabs;
            }
        } else {
            // Cesempli
            return this.basicInversion(
                new Array (
                    syllabs.slice(0,-1).reduce((a, b) => a + b, ""),
                    syllabs.pop()  //Last elem
            ));
        }
    };

    doesItSoundBad (syllabs) {
        // Check if the syllabs, when merged into a word, generate two letters
        // that are in bad_pairs
        console.log("Pronounciation check on " + syllabs)
        for (let i = 0; i < syllabs.length - 1; i++) {
            let curr = syllabs[i];
            let lastLetterCurr = curr.slice(-1)[0];
            let next = syllabs[i+1];
            let firstLetterNext = next[0];
            if (bad_pairs.includes(lastLetterCurr + firstLetterNext)) {
                return true;
            } else {
                return false;
            }
        }
    };

    removeDoubleLetters (syllabs) {
        for (let i = 0; i < syllabs.length - 1 ; i++) {
            let prev = syllabs[i]
            let succ = syllabs[i+1]
            if (prev.slice(-1)[0] === succ[0]) {
                syllabs[i] = prev.slice(0, -1);
            }
        }
        return syllabs;
    }


};


// Todo: skeleton for seba translation
// def search_basic_translation(word):
// synonims = find_synonims(word)
// translation = None
// for s in synonims:
//     translation = basics_translations.get(s, None)
// return translation



