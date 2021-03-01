import { Translator } from './translator.js'
 
document.addEventListener("DOMContentLoaded",
  function (event) {
    /**
     * Get sentence inserted by user and translates it.
     */
    function onClickTranslate (event) {
      // Instantiate translator with correct parameters
      let percentage = document.getElementById('percentageInput').value;
      let nezioCheckBox = document.getElementById("nezioCheckbox");
      let erreMossaCheckbox = document.getElementById("erreMossaCheckbox")
      let erreMossaAllConsonantsCheckbox = document.getElementById("erreMossaAllConsonantsCheckbox")
      let superTofeCheckbox = document.getElementById("superTofeCheckbox")

      var translator = new Translator(
        percentage,
        nezioCheckBox.checked,
        erreMossaCheckbox.checked,
        erreMossaAllConsonantsCheckbox.checked,
        superTofeCheckbox.checked,
      )

      // Get text to be translated
      let toBeTrasnslated =
       document.getElementById("wannabe-translated").value;
      // Translate and output (if input is not empty)
      let translation
      if (toBeTrasnslated === "") {
        document
          .getElementById("user-input")
          .textContent = "";
        document
          .getElementById("translation")
          .textContent = "Il silenzio è dei babbi di gnole o dei rosbi... \
            scrivi qualsaco e premi 'riocontralo'!" ;
      } else {
        translation = translator.translateSentence(toBeTrasnslated)
        console.log("Translation: " + translation);

        document
          .getElementById("user-input")
          .textContent = "Tu vuoi dire all'ozi: '" + toBeTrasnslated + "'.";
          
        document
          .getElementById("translation")
          .textContent = "Ma l'ozi direbbe: '" + translation + "'.";
      }

    }
    /**
     * Translate when the translate-button is clicked
     */
    document.getElementById("translate-button")
      .addEventListener("click", onClickTranslate);
    
    /**
     * Translate when enter is pressed
     */
    document.getElementById('wannabe-translated')
      .addEventListener("keyup", function (event) {
        let key = event.key || event.keyCode;
        if (key === "Enter") {
          onClickTranslate(event)
        }
      });

  }
);




