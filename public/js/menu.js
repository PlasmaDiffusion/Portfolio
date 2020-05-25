//Button click events ---------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    //Find all buttons
    document.querySelectorAll('button').forEach(button => {
        
        
    //Click a button to show information of a website/game.
        if (button.className == "btn")
        {
        button.onclick = () =>
            {
            document.getElementById(button.value).style.display = "block";
            document.getElementById("websites").style.display = "none";
            document.getElementById("games").style.display = "none";
            
            //Put up the first preview image
            document.getElementById(button.value + "_preview").click();
            };
        }

    //Click close button to get rid of information
        else if (button.className == "close")
        {
            button.onclick = () =>
            {
                document.getElementById(button.value).style.display = "none";
                document.getElementById("websites").style.display = "block";
                document.getElementById("games").style.display = "block";
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

    //Now find the hidden <p>s that contain image or video data
    let parentDiv = button.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var imageNodes = null;
    
    //Find the div containing the strings we need
    for (var i = 0; i < parentDiv.childNodes.length; i++)
     {
        if (parentDiv.childNodes[i].className == "itemStrings") {
            imageNodes = parentDiv.childNodes[i];
          break;
        }        
     }

    //Failsafe if nothing is found
    if (!imageNodes) return;

    let imageSrcs = [imageNodes.childNodes[1].innerHTML, imageNodes.childNodes[3].innerHTML,imageNodes.childNodes[5].innerHTML,imageNodes.childNodes[7].innerHTML];

    //Check for video
    let videoSrc = imageNodes.childNodes[1].innerHTML;
        
    let offset = 1;
    if (videoSrc) offset = 0;

    let buttonIndex = parseInt(button.value) + offset;

    //Fill in this button, but not the other ones.
    let parent = button.parentNode;

    for (let i = 1; i <= 5; i+=2)
    {
        parent.childNodes[i].className = "changePreview";
        console.log(parent.childNodes[i].innerHTML)
    
        //Hide buttons that don't have anything.
        if (imageNodes.childNodes[i+(2*offset)].innerHTML == "") parent.childNodes[i].className = "changePreviewEmpty";
    }
    
    button.className = "changePreviewSelected";
    
    


    //Check if showing a video
    CheckIfVideoOrImage(buttonIndex, imageSrcs);

}

function CheckIfVideoOrImage(buttonIndex, imageSrcs) {
    if (buttonIndex > 0) {
        //Give all preview images this image. You'll only see one at a time.
        document.querySelectorAll("img").forEach(image => {
            if (image.className == "previewImage") {
                if (imageSrcs[buttonIndex]) //Make there's an actual image to show
                {
                    image.src = imageSrcs[buttonIndex];
                }
                image.style.display = "block";
            }
        });
        //Hide videos
        document.querySelectorAll("iframe").forEach(video => {
            video.style.display = "none";
        });
    }
    else {
        //Hide images
        document.querySelectorAll("img").forEach(image => {
            if (image.className == "previewImage")
                image.style.display = "none";
        });
        //Show videos
        document.querySelectorAll("iframe").forEach(video => {
            video.style.display = "block";
        });
    }
}
