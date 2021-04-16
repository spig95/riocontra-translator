import { Translator } from './translator.js'

document.mode = "supercazzolaro";
document.oldMode = "supercazzolaro";
document.allowedModes = [
  "none",
  "boba",
  "chiove",
  "supercazzolaro",
  "advancedSettings"
]

document.changeMode = function(newMode) {
  let isAllowed = document.allowedModes.includes(newMode);
  if (isAllowed) {
    document.oldMode = document.mode;
    document.mode = newMode;
  } else {
      throw newMode + " not accepted. Choose one in " + document.allowedModes;
  }
  
}


/**
 * Add divs to output div. These are styled by output styles css
 */
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
    "</div>";
  // Show the "cancel element"
  document.getElementById("eraseTranslation").classList = "close";
}

/**
 * Delete all user input and hide the delete button
 */
document.eraseTranslation = function(x) {
  console.log("Erase translation")
  document.getElementById("output").innerHTML = "";
  document.getElementById("finalInfo").innerHTML = "";
  document.getElementById("wannabe-translated").value = "";
  // Hides the "cancel element"
  document.getElementById("eraseTranslation").classList = "close d-none";
}

document.addEventListener("DOMContentLoaded",
  function (event) {

    function setRosbiSettings(event) {
      document.changeMode("rosbi");
      document.getElementById('percentageInput').value = 0;
      document.getElementById("nezioCheckbox").checked = false;
      document.getElementById("erreMossaCheckbox").checked = false;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = false;
      document.getElementById("supertofeNo").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setBobaSettings(event) {
      document.changeMode("boba")
      document.getElementById('percentageInput').value = 25;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaCheckbox").checked = true;
      document.getElementById("supertofeNo").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setChioveSettings(event) {
      document.changeMode("chiove")
      document.getElementById('percentageInput').value = 50;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("supertofeSometimes").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function setSupercazzolaroSettings(event) {
      document.changeMode("supercazzolaro")
      document.getElementById('percentageInput').value = 100;
      document.getElementById("nezioCheckbox").checked = true;
      document.getElementById("erreMossaAllConsonantsCheckbox").checked = true;
      document.getElementById("supertofeAlways").checked = true;
      displayCurrentMode()
      onClickTranslate(event)
    }

    function activateAdvancedSettings(event) {
      document.changeMode("advancedSettings")
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
      let erreMossaAllConsonantsCheckbox = 
        document.getElementById("erreMossaAllConsonantsCheckbox")
      let supertofePercentage;

      if (document.getElementById("supertofeNo").checked) {
        supertofePercentage = 0;
      } else if (document.getElementById("supertofeSometimes").checked) {
        supertofePercentage = 50;
      } else if (document.getElementById("supertofeAlways").checked) {
        supertofePercentage = 100;
      }

      var translator = new Translator(
        percentage,
        nezioCheckBox.checked,
        erreMossaCheckbox.checked,
        erreMossaAllConsonantsCheckbox.checked,
        supertofePercentage,
      )

      // Get text to be translated
      let toBeTrasnslated =
       document.getElementById("wannabe-translated").value;

      // Remove focus from input group (hides keyboard on smartphone)
      document.getElementById("wannabe-translated").blur()

      // Translate and output (if input is not empty)
      if (toBeTrasnslated === "") {
        // Erase all content if the input is empty
        document.eraseTranslation();
        document.getElementById("finalInfo").textContent = 
          "Scrivi una frase in italiano e premi su 'riocontralo!' per la sua " +
          "tradunezio in riocontra. Scegli a chi affidare la " +
          "tradunezio (rosbi, boba, chiove, supercazzolaro), o se sei un esperto " +
          "usa le impostanezio avanteza!";
      } else {
        // Compute translation
        let translation = translator.translateSentence(toBeTrasnslated)
        console.log("Translation: " + translation);

        // Add HTML division inside output container with an id depending on the
        // mode
        if (document.mode === "rosbi") {
          document.writeTranslationOutput(
            translation, 
            "rosbiTranslation");
        } else if (document.mode === "boba") {
          document.writeTranslationOutput(
            translation, 
            "bobaTranslation");
        } else if (document.mode === "chiove") {
          document.writeTranslationOutput(
            translation, 
            "chioveTranslation");
        } else if (document.mode === "supercazzolaro") {
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
          "Seleziona un altro traduttore (rosbi, boba, chiove, supercazzolaro ...) " +
          "e cacli ancora su 'Riocontralo!' " +
          "per una nuova traduzione.";
      }

    }

    function displayCurrentMode (event) {
        // If the mode is one of the buttons, we keep showin the focus on 
        // that button, otherwise we let the focus go away
        document.getElementById(document.oldMode + "Button")
          .classList.remove("focus");
        if (document.mode != "advancedSettings") {
          document.getElementById(document.mode + "Button")
            .classList.add("focus")
          document.getElementById("currentModeInfo").innerHTML = "\
            Traduttore in <span class='font-weight-bold'>" + 
            document.mode + " </span> mode.";
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
    setSupercazzolaroSettings()
    
    // Cancel current translation
    document.getElementById("eraseTranslation")
      .addEventListener("click", document.eraseTranslation)

  }
);


// Viewport units trick
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);



