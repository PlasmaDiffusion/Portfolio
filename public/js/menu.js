//Script for mostly non-canvas related events
document.addEventListener('DOMContentLoaded', () => {

    //Find all buttons
    document.querySelectorAll('button').forEach(button => {
        
        
    //Click a button to show information of a website/game.
        if (button.className == "btn")
        {
        button.onclick = () =>
            {
            document.getElementById("itemInfo").style.visibility = "visible";
            document.getElementById("websites").style.visibility = "collapse";
            };
        }

    //Click close button to get rid of information
        else if (button.className == "close")
        {
            button.onclick = () =>
            {
                document.getElementById("itemInfo").style.visibility = "collapse";
                document.getElementById("websites").style.visibility = "visible";
            };  
        }
    //Cycle through images/videos
        else if (button.className == "changePreview")
        {
            button.onclick = () =>
            {

            let imageSrcs = ["/images/angryBert.png","/images/chickenPicnic.png","/images/knuckles.jpg"]
            document.getElementById("image0").src = imageSrcs[button.value];
            };
        }

    });

});