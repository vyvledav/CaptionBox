CaptionBox
=========

CaptionBox was originally created with an aim to provide alternative to fancybox that will give more appealing solution for photographic websites. When presenting images there is often need for rich textual caption to make the story of the image go. Still, the most important part remains to provide as large image as possible. CaptionBox offers solution with **custom and rich captions** both for **large screens and mobile devices**.

Visit [plugin page](http://captionbox.davidvyvlecka.cz/) to see it in action.

Benefits
--------

* Custom and large captions
* Maximizes image size with full caption visible (desktop)
* Maximizes image size (mobile)
* Possibly unique URL of each open image
* Support for basic exif information (via [exif.js](https://github.com/exif-js/exif-js))
* Click, keyboard and swipe navigation

Usage
-----

Load jquery and css files in head (make sure you put captionbox.js after jquery library and that you have [exif.js](https://github.com/exif-js/exif-js) loaded):

    <link rel="stylesheet" href="/css/captionbox.css">
    <script src="/js/captionbox.js"></script>

Put CaptionBox basic tag and plugin initialization inside body tag:

    <div id="captionBox"></div>
    <script>
       $(document).ready(function(){
          $('#captionBox').CaptionBox();
       });    
    </script>
    
By default CaptionBox processes anchor elements with class="captionBoxImage". Make your href point to original image. Optionally provide custom caption:

    <a class="captionBoxImage" href="/path_to_your_image.jpg">
       <img src="/path_to_your_thumnail.jpg"/>
       <div class="customCaption">
          Any elements you desire.
       </div>
    </a>
    
 Options
 -------
 
 For options visit [plugin page](http://captionbox.davidvyvlecka.cz/)
