import {
  ChangePreviewImage,
  CheckIfVideoOrImage,
  GetValueOfSelectedButton,
} from "./menuFunctions.js";

//Button click events ---------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  var lastMenu = "#websites";

  //Find all buttons
  document.querySelectorAll("button").forEach((button) => {
    //Click a button to show information of a website/game.
    if (button.className == "btn") {
      button.onclick = () => {
        document.getElementById(button.value).style.display = "block";
        document.getElementById("websites").style.display = "none";
        document.getElementById("games").style.display = "none";
        document.getElementById("Opening").style.display = "none";

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
        document.getElementById(button.value).style.display = "none";
        document.getElementById("websites").style.display = "block";
        document.getElementById("games").style.display = "block";
        document.getElementById("Opening").style.display = "block";

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
