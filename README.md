# composite_images
Composite an uploaded image with an overlay to create a preview.

My use case was for a user to upload a photo to that would then display in all the greeting cards on the page so she could get a peek at how the card designs might look with a desired photo.

This script also includes gathering filters and querying for new results all while preserving the preview image. 

The user photo is never actually uploaded to the server. It's stored in the browser's cache and the date is loaded into a canvas element. Once loaded into the canvas, the overlay for the card design is added to the canavs to complete the preview. 

The script compares the dimensions of the uploaded photo with the orientation of the card. If the photo's width is too small for the card (because the photo is vertical and the card is horizontal), the photo will enlarge to fit the width of the card.

Cards display based on the filters set (ie. by category). It builds an AJAX call based on the filters. The service requested is performed by PHP that returns the data marked up with HTML. The crucial data is returned in a JSON array. The results are displayed on the page and the uploaded photo is iterated over each card using card data from the JSON array.  
