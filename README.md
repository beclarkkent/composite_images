# composite_images
Composite an uploaded image with an overlay to create a preview.

My use case was for a user to upload a photo to that would then display in all the greeting cards on the page so she could get a peek at how the card designs might look with a desired photo.

This script also includes gathering filters and querying for new results all while preserving the preview image. 

First, the script retrieves the photo from the file uploader. The photo is not actually uploaded to the server, but rather stored in memory.

It's important to remember that each card is made up of a bottom image (the uploaded photo) and a top image (the card design).

A JSON array (json.cards[ ]) of each card's top image is iterated over to build two other arrays (b and t) that matches the uploaded photo (that will become the new bottom photo) with each card design (top image). 

```
function combineImages(newImg) {
    for (var i = 0; i < count; i++) {
        var item = json.cards[i];
        b[item.id] = loadImage(item.id, newImg, "bottom"+item.id,true);
        t[item.id] = loadImage(item.id, item.top, "top"+item.id,true);
    }
}
```

A copy of the uploaded photo is stored in array b[ ] for every card design stored in a[ ]. Extra logic is in place because this is also executed on page load when there is no uploaded photo and so the default bottom photo is used. 

```
function loadImage(id, src, typeid,uimage) {
    img[typeid] = new Image();
    img[typeid].src = src;
    img[typeid].onload = function() {
        loadedImages++
        if (loadedImages == count*2) {
            loadedImages = 0;
            if (uimage == true) {
                drawImages(true);
            } else {
                drawImages(false);
            }
        }
    }
    return img[typeid];
}
```

The heart and soul of the this script lies inside the drawImages() function. As the array for the bottom and top images are built, the drawImages() function displays the final composite image on the page.

The array that stores all the card's information includes where in the design to position the uploaded photo. This is known as "window" in the script. As the script iterates over the cards array, it's drawing the composite photo into corresponding canvas elements. Before drawing the images, it determines if the orientation of the uploaded photo matches that of the window. If the the photo is too short for the window, it draws the photo large enough to fit while maintaining aspect ratio. Same is so if the uploaded photo is too narrow in width for the window. 

```
function drawImages(uimage) {

    var istart = load_offset;

    for (var i = 0; i < count; i++) {
        var item = json.cards[i];
        var offset = i+1;
        var canvas = document.getElementById('canvas'+offset);
        var canvas_w = canvas.scrollWidth;
        var canvas_h = canvas.scrollHeight;
        
        var window_w = (item.window_rx-item.window_lx);
        var window_h = (item.window_by-item.window_ty)  ;
        var window_x = item.window_lx;
        var window_y = item.window_ty;

        var bottom_w = img["bottom"+item.id].width; //uploaded photo (aka: bottom photo)
        var bottom_h = img["bottom"+item.id].height;
        var top_w = img["top"+item.id].width; //card overlay (aka: top photo)
        var top_h = img["top"+item.id].height;

        var horz_bottom_h = window_w/(bottom_w/bottom_h); //desired width / uploaded photo ratio
        var vert_bottom_w = window_h*(bottom_w/bottom_h); //desired height * uploaded photo ratio

        var vert_bottom_x = (window_x-(vert_bottom_w-window_w)/2); //center the bottom photo vertically
        var horz_bottom_y = (window_y-(horz_bottom_h-window_h)/2); //center the bottom photo horizontally

        if (window_w > window_h) {
            //window is vertical
                if (horz_bottom_h < window_h) {
                    //resized bottom photo is too short for window so make it fit
                    ctx[item.id].drawImage(img["bottom"+item.id], vert_bottom_x, window_y, vert_bottom_w, window_h);
                } else {
                    ctx[item.id].drawImage(img["bottom"+item.id], window_x, window_y, window_w, horz_bottom_h);
                }
            ctx[item.id].drawImage(img["top"+item.id], 0, 0, canvas_w, canvas_h);
        } else {
            //window is horizontal
            if (vert_bottom_w < window_w) {
                //resized bottom photo is to tall for window so make it fit
                ctx[item.id].drawImage(img["bottom"+item.id], window_x, window_y, window_w, horz_bottom_h);
            } else {
                ctx[item.id].drawImage(img["bottom"+item.id], vert_bottom_x, window_y, vert_bottom_w, window_h);
            }
            ctx[item.id].drawImage(img["top"+item.id], 0, 0, canvas_w, canvas_h);
        }

        if (i == (count-1)) {
            jQuery('.card-loader2').css('display', 'none');
        }
    }
}
```
