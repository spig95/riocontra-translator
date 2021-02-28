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
        supertofe) {

        this.percentage = percentage;

        if (nezioTechnique == undefined) {
            this.nezioTechnique = true
        } else if (typeof(nezioTechnique) === "boolean") {
            this.nezioTechnique = nezioTechnique
        } else {
            throw "nezioTechnique should be a boolean. Got " + nezioTechnique
        }

        if (erreMossa == undefined) {
            this.erreMossa = true
        } else if (typeof(erreMossa) === "boolean") {
            this.erreMossa = erreMossa
        } else {
            throw "erreMossa should be a boolean. Got " + erreMossa
        }

        if (erreMossaToAllConsonants == undefined) {
        this.erreMossaToAllConsonants = false
        } else if (typeof(erreMossaToAllConsonants) === "boolean") {
            this.erreMossaToAllConsonants = erreMossaToAllConsonants
        } else {
            throw "erreMossaToAllConsonants should be a boolean. Got " +  
                erreMossaToAllConsonants;
        }
        
        if (supertofe == undefined) {
            this.supertofe = true
        } else if (typeof(supertofe) === "boolean") {
            this.supertofe = supertofe
        } else {
            throw "supertofe should be a boolean. Got " + supertofe
        }

    };

    translateSentence (sentence) {
        console.log("input sentence: ", sentence);
        let splitted = splitSentence(sentence);
        console.log("splitted: ", splitted);
        // Loop over splitted sentence, translate each word and recompose the 
        // translated sentence
        let translatedSentence = new String
        splitted.forEach(
            function(word) {
            if (isSpecialChar(word))
                // Just add it to the sentence
                translatedSentence += word;
            else
                // Translate and add
                translatedSentence += this.translateWord(word);
            },
            this // Second argument of forEach specifies who is "this"
        ); 
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
        let syllabs = divide(word)
        let translatedWord = this.getRiocontraFromSyllabs(syllabs)
        if (this.translateWord === null) {
            return word
        }
        else {
            // If nothing worked, we do not translate
            return translatedWord;
        }
    };

    getRiocontraFromSyllabs (syllabs) { 
        console.log("Get riocontra from syllabs: ", syllabs)
        let invertedSyllabs
        let n_syllabs = syllabs.length

        if (n_syllabs === 2) {
            invertedSyllabs = this.invertTwoSyllabs(syllabs)
        } else if (n_syllabs === 3) {
            invertedSyllabs = this.invertThreeSyllabs(syllabs)
        } else if (n_syllabs === 4) {
            invertedSyllabs = this.invertFourSyllabs(syllabs)
        } else if (n_syllabs > 4) {
            invertedSyllabs = this.invertLongWords(syllabs)
        } else {
            invertedSyllabs = syllabs
        }

        // Sum inverted syllabs to form the word
        console.log(invertedSyllabs)
        let wordFromSyllabs = invertedSyllabs.reduce((a, b) => a + b, "")
        return wordFromSyllabs
    }

    invertTwoSyllabs (syllabs) {
        let originalSyllabs = syllabs.slice();
        let invertedSyllabs

        syllabs = this.removeDoubleConsonants(syllabs)

        console.log(syllabs)
        invertedSyllabs = syllabs.reverse();

        // Erremossa technique
        if ((this.erreMossa) | (this.erreMossaToAllConsonants)) {
            let lastInvSyllab = invertedSyllabs.slice(-1)[0]
            let lastLetter = lastInvSyllab.slice(-1)[0]
            if (
                ((this.erreMossa) & (lastLetter === "r")) |
                ((this.erreMossaToAllConsonants) & !(isVowel(lastLetter)))
                ) {
                    invertedSyllabs = [
                        invertedSyllabs[0], lastLetter, lastInvSyllab.slice(0, -1)
                    ];
                }
        } 

        // Check if we can pronounce it
        if (this.doesItSoundBad(invertedSyllabs)) {
            return originalSyllabs;
        } else {
            return invertedSyllabs;
        }
    };

    invertThreeSyllabs (syllabs) {
        let invertedSyllabs
        invertedSyllabs = this.invertTwoSyllabs(
            new Array (
                syllabs[0],
                syllabs[1] + syllabs[2]
        ))
        // If the word did not change, we can try a different combination.
        if (invertedSyllabs === syllabs) {
            invertedSyllabs = this.invertTwoSyllabs(
                new Array (
                syllabs[0] + syllabs[1],
                syllabs[2]
            ))
        }
        // We return invertedSyllabs (they can be non inverted if the inversion failed inside invertTwoSyllabs)
        return invertedSyllabs
    };

    invertFourSyllabs (syllabs) {
        if (this.supertofe) {
            // Supertofe: invert first two, invert last two and then concatenate
            let firstInverted = this.invertTwoSyllabs(syllabs.slice(0, 2));
            let lastInverted = this.invertTwoSyllabs(syllabs.slice(-2));
            let invertedSyllabs = firstInverted.concat(lastInverted);
            // Check if we can pronounce it
            if (this.doesItSoundBad(invertedSyllabs)) {
                return syllabs;
            } else {
                return invertedSyllabs;
            }
        } else {
            return syllabs
        }
    };

    invertLongWords (syllabs) {
        if (syllabs.length < 5) {
            throw "Apply only on words with at least 5 syllabs. Got " + syllabs
        }

        if (this.supertofe) {
            // This is a advanced supertofe technique
            let firstInverted = this.invertTwoSyllabs(syllabs.slice(0, 2))
            let lastInverted = this.invertThreeSyllabs(syllabs.slice(-3))
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
            return syllabs
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

    removeDoubleConsonants (syllabs) {
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


// word = recompose_word_from_syllabs(syllabs)

// # triplets = [word[i:i+3] for i in range(len(word) - 3)]
// # if any([])

// return word


