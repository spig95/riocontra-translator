import { Translator } from './translator.js'

document.activeButton = "rosbiButton";
document.oldactiveButton = "rosbiButton";

document.addEventListener("DOMContentLoaded",
  function (event) {

    function setRosbiSettings(event) {
      document.oldactiveButton = document.activeButton
      document.activeButton = "rosbiButton"
      document.getElementById('percentageInput').value = 0;
      document.getElementById("nezioCheckbox").checked = false;
      document.getElementById("erreMossaCheckbox").checked = false;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = false;
      document.getElementById("superTofeCheckbox").checked = false;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setBobaSettings(event) {
      document.oldactiveButton = document.activeButton
      document.activeButton = "bobaButton"
      document.getElementById('percentageInput').value = 25;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = false;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setChioveSettings(event) {
      document.oldactiveButton = document.activeButton
      document.activeButton = "chioveButton"
      document.getElementById('percentageInput').value = 50;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setSupercazzolaroSettings(event) {
      document.oldactiveButton = document.activeButton
      document.activeButton = "supercazzolaroButton"
      document.getElementById('percentageInput').value = 100;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("superTofeCheckbox").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function activateAdvancedSettings(event) {
      document.oldactiveButton = document.activeButton
      document.activeButton = "advancedSettingsButton"
      displayCurrentMode()
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
          .getElementById("translation")
          .textContent = "Il silenzio è dei babbi di gnole o dei rosbi... \
            scrivi qualsaco e premi 'riocontralo'!" ;
      } else {
        translation = translator.translateSentence(toBeTrasnslated)
        console.log("Translation: " + translation);

        let introString;
        if (document.activeButton === "advancedSettingsButton") {
          introString = "Tradunezio: '"
        } else {
          introString = "Il " + document.activeButton.slice(0, -6) + " direbbe: '"
        }
        
        document
          .getElementById("translation")
          .innerHTML = "<section>" + introString + translation + "'." +
            "</section>" + 
            "<section id='finalInfo'> Cambia impostanezio o cacli ancora su 'Riocontralo!' " +
            "per una nuova traduzione ... </section>";
      }

    }

    function displayCurrentMode (event) {
        let oldButtonId = document.oldactiveButton
        let newButtonId = document.activeButton
        document.getElementById(oldButtonId).classList.remove("focus")
        document.getElementById(newButtonId).classList.add("focus")
    }


    document.getElementById("translate-button")
      .addEventListener("click", onClickTranslate);
    
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

    document.getElementById('advancedSettingsButton')
      .addEventListener("click", activateAdvancedSettings)
    
    // Call the following functions when the document is loaded
    setRosbiSettings()
  }
);




