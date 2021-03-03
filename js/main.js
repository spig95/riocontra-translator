import { Translator } from './translator.js'
 
document.addEventListener("DOMContentLoaded",
  function (event) {

    function setRosbiSettings(event) {
      document.getElementById('percentageInput').value = 0;
      document.getElementById("nezioCheckbox").checked = false;
      document.getElementById("erreMossaCheckbox").checked = false;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = false;
      document.getElementById("superTofeCheckbox").checked = false;
    }

    function setBobaSettings(event) {
      document.getElementById('percentageInput').value = 25;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = false;
    }

    function setChioveSettings(event) {
      document.getElementById('percentageInput').value = 50;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = true;
    }

    function setSupercazzolaroSettings(event) {
      document.getElementById('percentageInput').value = 100;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = true;
    }

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
          .innerHTML = "<section> Ma l'ozi direbbe: '" + translation + "'." +
            "</section>" + 
            "<section> Cambia impostanezio e cacli ancora su 'Riocontralo!' " +
            "per una nuova traduzione ... </section>";
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
    
    document.getElementById('rosbiButton')
      .addEventListener("click", setRosbiSettings)
    
    document.getElementById('bobaButton')
      .addEventListener("click", setBobaSettings)

    document.getElementById('chioveButton')
      .addEventListener("click", setChioveSettings)

    document.getElementById('supercazzolaroButton')
      .addEventListener("click", setSupercazzolaroSettings)
  }
);




