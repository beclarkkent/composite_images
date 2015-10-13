/*var json = jQuery.parseJSON('{"cards":['
    + '{"id":"1", "bottom":"/mash/cards/card1.png", "top":"/mash/cards/card1t.png", "bx":"0", "by":"31", "tx":"0", "ty":"0", "orient":"h"}, '
    + '{"id":"2", "bottom":"/mash/cards/card2.png", "top":"/mash/cards/card2t.png", "bx":"0", "by":"71", "tx":"0", "ty":"0", "orient":"v"}, '
    + '{"id":"3", "bottom":"/mash/cards/card3.png", "top":"/mash/cards/card3t.png", "bx":"0", "by":"0", "tx":"0", "ty":"0", "orient":"h"}]}');
*/

//check browser support
if (window.FormData === undefined) {
    alert("Your browser does not support this feature. Please upgrade your browser to Internet Explorer 10, Google Chrome or Mozilla Firefox.")
}


jQuery('#card-preview-upload-button').click(function () {
    jQuery('#imguploader').focus().click(); // Open dialog
});


//jQuery(document).ready(function(){



var c = [];
var ctx = [];
var b = [];
var t = [];
var cid = [];
var img = [];
var count;
var loadedImages = 0;
var load_offset = 0;
var per_page = 20;
var json = new Object();
json.cards = [];
var customer_photo;


//jQuery(window).bind("load", function() {
//
//    var count = Object.keys(json.cards).length;
//
//    jQuery('.card-loader').fadeTo('slow', 1);
//
//    for (var i = 0; i < count; i++) {
//        var item = json.cards[i];
//        c[item.id] = document.getElementById("canvas"+item.id);
//        ctx[item.id] = c[item.id].getContext("2d");
//        ctx[item.id].scale(0.6, 0.6);
//        b[item.id] = loadImageInit(item.id, item.top, "bottom"+item.id);
//        t[item.id] = loadImageInit(item.id, item.bottom, "top"+item.id);
//
//
//    }
//
//});

function drawImagesInit() {
    for (var i = load_offset; i < count; i++) {
        var item = json.cards[i];
        var offset = i+1;
        var canvas = document.getElementById('canvas'+offset);
        var canvas_w = canvas.scrollWidth;
        var canvas_h = canvas.scrollHeight;

        var bottom_w = img["bottom"+item.id].width; //uploaded photo (aka: bottom photo)
        var bottom_h = img["bottom"+item.id].height;
        var top_w = img["top"+item.id].width; //card overlay (aka: top photo)
        var top_h = img["top"+item.id].height;

        var horz_bottom_h = canvas_w/(bottom_w/bottom_h); //desired width / uploaded photo ratio
        var vert_bottom_w = canvas_h*(bottom_w/bottom_h); //desired height * uploaded photo ratio

        var vert_bottom_x = (vert_bottom_w-canvas_w)/2; //center the bottom photo vertically
        var horz_bottom_y = (horz_bottom_h-canvas_h)/2; //center the bottom photo horizontally

        if (canvas_w > canvas_h) {
            //card is vertical
            if (horz_bottom_h < canvas_h) {
                //resized bottom photo is too short for card so make it fit
                ctx[item.id].drawImage(img["bottom"+item.id], '-'+vert_bottom_x, 0, vert_bottom_w, canvas_h);
            } else {
                ctx[item.id].drawImage(img["bottom"+item.id], 0, '-'+horz_bottom_y, canvas_w, horz_bottom_h);
            }
            ctx[item.id].drawImage(img["top"+item.id], 0, 0, canvas_w, canvas_h);
        } else {
            //card is horizontal
            if (vert_bottom_w < canvas_w) {
                //resized bottom photo is to tall for card so make it fit
                ctx[item.id].drawImage(img["bottom"+item.id], 0, '-'+horz_bottom_y, canvas_w, horz_bottom_h);
            } else {
                ctx[item.id].drawImage(img["bottom"+item.id], '-'+vert_bottom_x, 0, vert_bottom_w, canvas_h);
            }
            ctx[item.id].drawImage(img["top"+item.id], 0, 0, canvas_w, canvas_h);

        }
    }
    //jQuery('.card-loader').fadeTo('slow', 0);
}

function loadImageInit(id, src, typeid) {

    img[typeid] = new Image();
    img[typeid].src = src;
    img[typeid].onload = function() {
        loadedImages++
        //console.log("Drawing: " + typeid + "....loadedImages: " + loadedImages + "  count: " + count + "  offset: " + load_offset);
        if (loadedImages == count*2) {
            //loadedImages = 0;
            drawImagesInit();
        }
   }

    return img[typeid];

}


function drawImages(uimage) {
    //if (uimage == true) {
    //    var istart = 0;
    //} else {
        var istart = load_offset;
    //}
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
            //jQuery('.card-loader').fadeTo('slow', 0);
        }
    }

}

function loadImage(id, src, typeid,uimage) {


    img[typeid] = new Image();
    img[typeid].src = src;
    img[typeid].onload = function() {
        loadedImages++
        //console.log("Drawing: " + typeid + "....loadedImages: " + loadedImages + "  count: " + count + "  offset: " + load_offset);
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


function combineImages(newImg) {

    for (var i = 0; i < count; i++) {
        var item = json.cards[i];
        //console.log(json.cards);
        b[item.id] = loadImage(item.id, newImg, "bottom"+item.id,true);
        t[item.id] = loadImage(item.id, item.top, "top"+item.id,true);
    }
}

jQuery('#imguploader').bind('change', function() {
    jQuery('.card-loader2').css('display', 'inline-block');

    var file = this.files[0]; //we can retrive the file array.
    // alert(file.type); if you want to check image type, uncomment this line.
    // alert(file.size); if you want to check the image size, uncomment this line.

    var reader = new FileReader();

    // file.target.result holds the DataURL which
    // can be used as a source of the image:

    //imgpreview is the id of the img tag where you want to display the image
    reader.onload = function(file){
        //$('#imgpreview').attr('src',  file.target.result);
        customer_photo = file.target.result
        loadedImages = 0;
        combineImages(customer_photo);
    };

    // Reading the file as a DataURL. When finished,
    // this will trigger the onload function above:
    reader.readAsDataURL(file);
});







    var card_cat = getUrlParameters("cat", "", true);
    card_cat = card_cat != false ? card_cat : "";

    var card_format = getUrlParameters("format", "", true)
    card_format = card_format != false ? card_format : "";

    var card_orient = getUrlParameters("orient", "", true)
    card_orient = card_orient != false ? card_orient : "";

    var card_photos = getUrlParameters("photos", "", true)
    card_photos = card_photos != false ? card_photos : "";

    var card_color = getUrlParameters("color", "", true)
    card_color = card_color != false ? card_color : "";

    var card_new = getUrlParameters("new", "", true)
    card_new = card_new != false ? card_new : "";

    var card_pop = getUrlParameters("pop", "", true)
    card_pop = card_pop != false ? card_pop : "";

    var card_designer = getUrlParameters("designer", "", true)
    card_designer = card_designer != false ? card_designer : "";

    var responseTemp = "";
    var results_count = 0;
    var results_offset = 0;


    function finishedAjax(responseText, more)
    {
        if (more == true) {
            //loadedImages = loadedImages+(load_offset*2);
            jQuery("#postContainer").append(responseText);
            count = Object.keys(json.cards).length;

            //jQuery('.card-loader').fadeTo('slow', 1);

            for (var i = load_offset; i < count; i++) {
                var item = json.cards[i];
                c[item.id] = document.getElementById("canvas"+item.id);
                ctx[item.id] = c[item.id].getContext("2d");
                //ctx[item.id].scale(0.6, 0.6);
            }

                if (customer_photo) {
                    combineImages(customer_photo);
                } else {
                    for (var i = load_offset; i < count; i++) {
                        var item = json.cards[i];
                        b[item.id] = loadImageInit(item.id, item.top, "bottom"+item.id);
                        t[item.id] = loadImageInit(item.id, item.bottom, "top"+item.id);
                    }
                }

            jQuery('#another').show();
            jQuery('.spinner-wrapper').remove();
        } else {
            //loadedImages = loadedImages+(load_offset*2);
            jQuery("#postContainer").html(responseText);

            count = Object.keys(json.cards).length;

            //jQuery('.card-loader').fadeTo('slow', 1);

            for (var i = load_offset; i < count; i++) {
                var item = json.cards[i];
                c[item.id] = document.getElementById("canvas"+item.id);
                ctx[item.id] = c[item.id].getContext("2d");
                //ctx[item.id].scale(0.6, 0.6);
            }

            if (customer_photo) {
                combineImages(customer_photo);
            } else {
                for (var i = load_offset; i < count; i++) {
                    var item = json.cards[i];
                    b[item.id] = loadImageInit(item.id, item.top, "bottom"+item.id);
                    t[item.id] = loadImageInit(item.id, item.bottom, "top"+item.id);
                }
            }


        }

        if (results_offset < per_page) {

            if (results_count < per_page) {
                results_offset = results_count;
                jQuery('.load-more-button').remove();
            } else {
                results_offset = per_page;

            }
        } else if (results_count >= per_page) {
            results_offset = results_offset+per_page;
        }
        if (results_offset > results_count) {
            results_offset = results_count;
        }
        jQuery('#results-count').html("Showing " + results_offset + " of " + results_count);


    }

        function loadCards() {
        jQuery.ajax({
            url: "/cards/more/?offset="+load_offset+"&cat="+card_cat+"&format="+card_format+"&orient="+card_orient+"&photos="+card_photos+"&color="+card_color+"&new="+card_new+"&designer="+card_designer+"&pop="+card_pop,
            context: document.body,
            success: function(responseText) {
                //console.log(responseText);
                finishedAjax(responseText, false);
            }
        });
}
function loadMore() {
    //jQuery("#another").click(function(){

    jQuery('#another').hide();
    //jQuery('.spinner-wrapper').show();
    jQuery("#postContainer").append('<div class="spinner-wrapper"  style="background: #fff;width:80px;height:80px;z-index:10;border-radius: 4px;box-shadow: 0 0 20px rgba(0,0,0,.2);display:inline-block;position:relative;margin-top:150px;margin-left:155px"><div class="spinner" style="display: inline-block;background-size: 50px;height: 50px;width: 50px;margin:15px"></div></div>');

    jQuery('.load-more-button').remove();
    load_offset = load_offset + per_page;
    jQuery.ajax({
        url: "/cards/more/?offset=" + load_offset + "&cat=" + card_cat + "&format=" + card_format + "&orient=" + card_orient + "&photos=" + card_photos + "&color=" + card_color+"&new="+card_new+"&designer="+card_designer+"&pop="+card_pop,
        context: document.body,
        success: function (responseText) {

            if (responseText.search("No Results.") == -1) {
                finishedAjax(responseText, true);
            } else {
                jQuery('.spinner-wrapper').remove();
                //jQuery('#nomore').show();
                jQuery("#postContainer").append('<div class="flex-column" style="margin: 180px 0 0 100px;">No More Cards</div>');
            }
        }
    });
    return false;
    //});
}

loadCards();


jQuery(document).ready(function ()
{
    jQuery("input[name='grp_cat']").change(setFilters);
    jQuery("input[name='grp_photos']").change(setFilters);
    jQuery("input[name='grp_orient']").change(setFilters);
    jQuery("input[name='grp_format']").change(setFilters);
    jQuery("input[name='grp_color']").change(setFilters);
    jQuery("#show_new").change(setFilters);
    jQuery("#show_pop").change(setFilters);
});


function setFilters() {

    var cat_value = jQuery("input:radio[name ='grp_cat']:checked").val();
    var photos_value = jQuery("input:radio[name ='grp_photos']:checked").val();
    var orient_value = jQuery("input:radio[name ='grp_orient']:checked").val();
    var format_value = jQuery("input:radio[name ='grp_format']:checked").val();
    var color_value = jQuery("input:radio[name ='grp_color']:checked").val();
    if (jQuery('#show_new').is(":checked"))
    {
        card_new = "new";
    } else {
        card_new = "";
    }
    if (jQuery('#show_pop').is(":checked"))
    {
        card_pop = "popular";
    } else {
        card_pop = "";
    }



    card_cat = cat_value != undefined ? cat_value : "";
    card_photos = photos_value != undefined ? photos_value : "";
    card_orient = orient_value != undefined ? orient_value : "";
    card_format = format_value != undefined ? format_value : "";
    card_color = color_value != undefined ? color_value : "";


    if (card_cat == "cmas") {
        jQuery('#category_name').html("Christmas");
    } else if (card_cat == "season") {
        jQuery('#category_name').html("Season's Greetings");
    } else if (card_cat == "han") {
        jQuery('#category_name').html("Hanukkah");
    } else if (card_cat == "newyear") {
        jQuery('#category_name').html("New Year");
    } else if (card_cat == "valentines") {
        jQuery('#category_name').html("Valentine's Day");
    } else if (card_cat == "savethedate") {
        jQuery('#category_name').html("Save the Date");
    } else if (card_cat == "grad") {
        jQuery('#category_name').html("Graduation Announcements");
    } else if (card_cat == "baby") {
        jQuery('#category_name').html("Baby Announcements");
    } else if (card_cat == "thank") {
        jQuery('#category_name').html("Thank You");
    } else if (card_cat == "bday") {
        jQuery('#category_name').html("Birthday Invites");
    } else if (card_cat == "") {
        jQuery('#category_name').html("All");
    }

    jQuery('#another').show();
    jQuery('#nomore').hide();

    c = [];
    ctx = [];
    b = [];
    t = [];
    cid = [];
    img = [];
    count = 0;
    loadedImages = 0;
    load_offset = 0;
    json.cards = [];

    loadCards();

}

function removeDesigner() {
    jQuery('#designer-filter').hide();
    card_designer = '';
    setFilters();
}

function allCats() {
    jQuery("input:radio[name='grp_cat']").each(function(i) {
        this.checked = false;
    });
    setFilters();
}

function resetFilters() {
    jQuery("input:radio").each(function(i) {
        this.checked = false;
    });
    jQuery("input:checkbox").each(function(i) {
        this.checked = false;
    });
    jQuery('#designer-filter').hide();
    card_designer = '';
    setFilters();
}