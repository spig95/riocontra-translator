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
      document.getElementById("translate-button").textContent = "Riocontred";
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
        .getElementById("user-input")
        .textContent = "Tu vuoi dire all'ozi: '" + toBeTrasnslated + "'.";
      
      document.getElementById("wannabe-translated").value = ""

      document
        .getElementById("translation")
        .textContent = "Ma l'ozi direbbe: '" + translation + "'.";;


    }
    
    /**
     * Empty the input field and change the button text to "riocontra again"
     */
    function riocontrAgain (event) {
      this.textContent = "Riocontra un'altra talvo!";
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
    
    /**
     * Get ready for new translation when the translate-button looses focus
     */
    document.getElementById("translate-button")
      .addEventListener("blur", riocontrAgain);

  }
);




