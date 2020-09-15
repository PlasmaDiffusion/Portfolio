import {
  ChangePreviewImage,
  CheckIfVideoOrImage,
  GetValueOfSelectedButton,
  ChangeElementDisplay,
} from "./menuFunctions.js";

//Button click events ---------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  var lastMenu = "#websites";

  //Find all buttons
  document.querySelectorAll("button").forEach((button) => {
    //Click a button to show information of a website/game.
    if (button.className == "btn") {
      button.onclick = () => {
        ChangeElementDisplay(button.value, "block");
        ChangeElementDisplay("websites", "none");
        ChangeElementDisplay("games", "none");
        ChangeElementDisplay("Opening", "none");
        ChangeElementDisplay("webDevSkills", "none");
        ChangeElementDisplay("gameDevSkills", "none");

        var spaces = document.getElementsByClassName("BigSpace");
        [].forEach.call(spaces, function (spaces) {
          spaces.style.display = "none";
        });

        //Put up the first preview image
        document.getElementById(button.value + "_preview").click();

        //Save what the last menu was
        lastMenu =
          "#" +
          button.parentNode.parentNode.parentNode.parentNode.parentNode
            .parentNode.id +
          "_Scroll";

        //Move to top of screen to see the whole thing
        window.location.href = "#top";
      };

      //Make the text smaller if the words are too big
      let buttonName = button.innerHTML.split(" ");
      if (buttonName[0].length > 8) button.style.fontSize = 12;
    }

    //Click close button to get rid of information
    else if (button.className == "close") {
      button.onclick = () => {
        ChangeElementDisplay(button.value, "none");
        ChangeElementDisplay("websites", "block");
        ChangeElementDisplay("games", "block");
        ChangeElementDisplay("Opening", "block");
        ChangeElementDisplay("webDevSkills", "block");
        ChangeElementDisplay("gameDevSkills", "block");

        var spaces = document.getElementsByClassName("BigSpace");
        [].forEach.call(spaces, function (spaces) {
          spaces.style.display = "block";
        });

        //Redirect to last menu
        window.location.href = lastMenu;
      };
    }
    //Cycle through images/videos
    else if (button.className == "changePreview") {
      button.onclick = () => {
        ChangePreviewImage(button);
      };
    } else if (button.className == "nextPreview") {
      button.onclick = () => GetValueOfSelectedButton(document, button, 1);
    } else if (button.className == "prevPreview") {
      button.onclick = () => GetValueOfSelectedButton(document, button, -1);
    }
  });
});
