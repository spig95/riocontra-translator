import Translator from './translator.js';
import { capitalizeWord, showElement } from './utils.js';

const defaultMode = 'supercazzolaro';

const translators = {
	rosbi: new Translator(0, false, false, false, 0, 2023),
	boba: new Translator(50, true, true, false, 0, 42),
	chiove: new Translator(75, true, true, true, 50, 0),
	supercazzolaro: new Translator(100, true, true, true, 100, 999),
};

function getTranslatorMode() {
	const mode = localStorage.getItem('translatorMode') || defaultMode;
	console.log(`mode is ${mode}`);
	return mode;
}

function displayTranslationMode() {
	const mode = capitalizeWord(getTranslatorMode());
	$('.translator-mode-text').each(function () {
		this.textContent = mode;
	});
}

function getTranslator() {
	return translators[getTranslatorMode()];
}

function showInputSentenceTranslation() {
	const sentence = document.getElementById('translation-input-text').value;
	if (sentence == null) return;
	const translator = getTranslator();
	const translatedSentence = translator.translateSentence(sentence);
	document.getElementById('translation-output-text').textContent = translatedSentence;
	showElement('output-translation');
}

function setTranslatorMode(translatorMode) {
	if (!(translatorMode in translators)) {
		throw new Error(`${translatorMode} not allowed!`);
	}
	localStorage.setItem('translatorMode', translatorMode);
	displayTranslationMode();
	showInputSentenceTranslation();
}

$(document).ready(() => {
	displayTranslationMode();

	document.getElementById('translate-button').addEventListener('click', showInputSentenceTranslation);

	document.getElementById('translation-input-text').addEventListener('keydown', (e) => {
		const keyCode = e.which || e.keyCode;
		if (keyCode === 13) {
			e.preventDefault();
			showInputSentenceTranslation();
		}
	});

	document.getElementById('select-rosbi').addEventListener('click', () => { setTranslatorMode('rosbi'); });
	document.getElementById('select-boba').addEventListener('click', () => { setTranslatorMode('boba'); });
	document.getElementById('select-chiove').addEventListener('click', () => { setTranslatorMode('chiove'); });
	document.getElementById('select-supercazzolaro')
		.addEventListener('click', () => { setTranslatorMode('supercazzolaro'); });
});
