import {
  ChangePreviewImage,
  CheckIfVideoOrImage,
  GetValueOfSelectedButton,
  ChangeElementDisplay,
  ChangeClassDisplay,
  MakeArrowsInvisible,
  MakeArrowsVisible,
} from "./menuFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
  //Button click events ---------------------------------------------------------------------------------------------

  var lastMenu = "#websites";

  //Find all buttons
  document.querySelectorAll("button").forEach((button) => {
    //Click a button to show information of a project.
    if (button.className == "btn" || button.className == "bigBtn") {
      button.onclick = () => {
        ChangeElementDisplay(button.value, "block");
        ChangeElementDisplay("websites", "none");
        ChangeElementDisplay("games", "none");
        ChangeElementDisplay("Opening", "none");
        ChangeElementDisplay("webDevSkills", "none");
        ChangeElementDisplay("gameDevSkills", "none");
        ChangeElementDisplay("contactMe", "none");
        ChangeClassDisplay("wave", "none");
        ChangeClassDisplay("BigSpace", "none");

        //Put up the first preview image
        document.getElementById(button.value + "_preview").click();

        //Save what the last menu was
        if (button.className == "btn")
          lastMenu =
            "#" + button.parentNode.parentNode.parentNode.parentNode.id;

        if (button.className == "bigBtn")
          lastMenu =
            "#" +
            button.parentNode.parentNode.parentNode.parentNode.parentNode.id;

        //Move to top of screen to see the whole thing (Usually only needed for mobile)
        window.location.href = "#top";
      };

      //Make the text smaller if the words are too big
      //let buttonName = button.innerHTML.split(" ");
      //if (buttonName[0].length > 8) button.style.fontSize = 12;
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
        ChangeElementDisplay("contactMe", "block");
        ChangeClassDisplay("wave", "block");
        ChangeClassDisplay("BigSpace", "block");

        //Redirect to last menu
        window.location.href = lastMenu;
      };
    }
    //Cycle through images/videos
    else if (button.className == "changePreview") {
      button.onclick = () => {
        ChangePreviewImage(button);
      };
    } //Next/previous image buttons
    else if (button.className == "nextPreview") {
      button.onclick = () => GetValueOfSelectedButton(button, 1);
    } else if (button.className == "prevPreview") {
      button.onclick = () => GetValueOfSelectedButton(button, -1);
    }
  });

  //OnMouseOver events ---------------------------------------------------------------------------------------------

  //Get all preview images, and make their arrows visible only when hovered over
  var imgs = document.getElementsByClassName("previewImage");
  [].forEach.call(imgs, function (image) {
    image.parentNode.children[0].style.opacity = 0;
    image.parentNode.children[1].style.opacity = 0;
    image.parentNode.onmouseover = () => {
      MakeArrowsVisible(image);
    };
    image.parentNode.onmouseleave = () => {
      MakeArrowsInvisible(image);
    };
  });
});
