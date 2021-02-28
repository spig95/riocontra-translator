import { Translator } from './translator.js'
 
document.addEventListener("DOMContentLoaded",
  function (event) {

    // TODO: read parameters somewhere
    var translator = new Translator(100)

    
    /**
     * Get sentence inserted by user and translates it.
     */
    function onClickTranslate (event) {
      // Change text inside button
      this.textContent = "Riocontred";
      // Get text to be translated
      let toBeTrasnslated =
       document.getElementById("wannabe-translated").value;
      // Translate and output (if input is not empty)
      let translation
      if (toBeTrasnslated === "")
        translation = "Il silenzio è dei babbi di gnole o dei rosbi... \
                      scrivi qualsaco!" ;
      else
        translation = translator.translateSentence(toBeTrasnslated)
      console.log("Translation: " + translation)
      document
        .getElementById("translation")
        .textContent = translation;
    }
    
    /**
     * Empty the input field and change the button text to "riocontra again"
     */
    function riocontrAgain (event) {
      this.textContent = "Riocontra un'altra talvo!";
      document.getElementById("wannabe-translated").value = ""
    }

    /**
     * Translate when the translate-button is clicked
     */
    document.querySelector("#translate-button")
      .addEventListener("click", onClickTranslate);
    
    /**
     * Get ready for new translation when the translate-button looses focus
     */
    document.querySelector("#translate-button")
      .addEventListener("blur", riocontrAgain);

  }
);




