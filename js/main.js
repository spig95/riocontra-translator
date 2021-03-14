import { Translator } from './translator.js'

document.activeButton = "rosbiButton";
document.oldactiveButton = "rosbiButton";

/**
 * Check the active button and return the current active mode
 * 
 * @returns rosbi, boba, chiove, supercazzolaro or advancedSettings
 */
document.getCurrentMode = function() {
  return document.activeButton.slice(0, -6);
};

document.writeTranslationOutput = function(translation, divID) {
  document.getElementById("output").innerHTML = 
    "<div id='" + divID + "' class='container'>" +
      "<div class='image'>" +
        "<div class='comics-speech'>" +
          "<div class='comics-content'>" +
            translation + 
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>"
}

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
      onClickTranslate(event)
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
      if (toBeTrasnslated === "") {
        // Erase all content if the input is empty
        document.getElementById("output").innerHTML = "";
        document.getElementById("finalInfo").innerHTML = ""
      } else {
        // Compute translation
        let translation = translator.translateSentence(toBeTrasnslated)
        console.log("Translation: " + translation);

        // Add HTML division inside output container with an id depending on the
        // mode
        if (document.getCurrentMode() === "rosbi") {
          document.writeTranslationOutput(
            translation, 
            "rosbiTranslation");
        } else if (document.getCurrentMode() === "boba") {
          document.writeTranslationOutput(
            translation, 
            "bobaTranslation");
        } else if (document.getCurrentMode() === "chiove") {
          document.writeTranslationOutput(
            translation, 
            "chioveTranslation");
        } else if (document.getCurrentMode() === "supercazzolaro") {
          document.writeTranslationOutput(
            translation, 
            "supercazzolaroTranslation");
        } else {
          // advancedSettings
          document.writeTranslationOutput(
            translation, 
            "advancedSettingsTranslation");
        }

        // Give some final info
        document.getElementById("finalInfo").textContent = 
          "Cambia impostanezio o cacli ancora su 'Riocontralo!' " +
          "per una nuova traduzione ... ";
      }

    }

    function displayCurrentMode (event) {
        // If the mode is one of the buttons, we keep showin the focus on 
        // that button, otherwise we let the focus go away
        document.getElementById(document.oldactiveButton).classList.remove("focus")
        document.getElementById(document.activeButton).classList.add("focus")
        if (document.getCurrentMode() != "advancedSettings") {
          document.getElementById("currentModeInfo").innerHTML = "";
        } else {
          document.getElementById("currentModeInfo").innerHTML = "Stai \
            usando le impostanezio avanteza!";
        }
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


// Viewport units trick
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);



