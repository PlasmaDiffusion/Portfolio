//Button click events ---------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    //Find all buttons
    document.querySelectorAll('button').forEach(button => {
        
        
    //Click a button to show information of a website/game.
        if (button.className == "btn")
        {
        button.onclick = () =>
            {
            document.getElementById(button.value).style.visibility = "visible";
            document.getElementById("websites").style.visibility = "collapse";
            
            //Put up the first preview image
            document.getElementById(button.value + "_preview").click();
            };
        }

    //Click close button to get rid of information
        else if (button.className == "close")
        {
            button.onclick = () =>
            {
                document.getElementById(button.value).style.visibility = "collapse";
                document.getElementById("websites").style.visibility = "visible";
            };  
        }
    //Cycle through images/videos
        else if (button.className == "changePreview")
        {
            button.onclick = () =>
            {
                changePreviewImage(button);
            };
        }

    });

});

//Global functions -----------------------------------------------------------------------------------------

//When a preview button is clicked, find the html elements that have said preview data.
function changePreviewImage(button)
{
    let parent = button.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var imageNodes = null;
    
    //Find the div containing the strings we need
    for (var i = 0; i < parent.childNodes.length; i++)
     {
        if (parent.childNodes[i].className == "itemStrings") {
            imageNodes = parent.childNodes[i];
          break;
        }        
     }

    if (imageNodes)
     {
        let imageSrcs = [imageNodes.childNodes[3].innerHTML,imageNodes.childNodes[5].innerHTML,imageNodes.childNodes[7].innerHTML]
        
        //Give all preview images this image. You'll only see one at a time.
        document.querySelectorAll("img").forEach(image => {
            
            if (image.className == "previewImage")
                if (imageSrcs[button.value]) //Make there's an actual image to show
                    image.src = imageSrcs[button.value];
        })
     }
}