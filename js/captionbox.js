/*
* CaptionBox, An image plugin for jQuery
* Intructions: http://captionbox.davidvyvlecka.cz/
* By: David Vyvlečka, http://davidvyvlecka.cz
* Version: 1.0.0
* Updated: September 17th, 2017
*
* Copyright 2017 David Vyvlečka
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function($){
    $.fn.CaptionBox = function(options) {  
 
        var opt = {
            imageSelector: '.captionBoxImage',
            alterUrlFlag: true,
            alterUrlString: 'img',
            showExif: true,
            mobileWidth: 900,
            swipeNav: true,
            disableRightClick: false,
            scrollBack: true
        };
                   
        var CB = $(this);
        var imgs_container = [{tgt: "/",caption: ""}];  // dummy element to count from 1
        var pos_id = 1;
        var count = 0;
        var mobile = ($(window).width() < opt.mobileWidth) ? true : false;
 
        return this.each(function() {        
            if (options) { 
                $.extend(opt, options);
            }
           
            var wrapper = $(this); 
            wrapper.empty();
            wrapper.append('<div class="close">&times;</div>');  
            wrapper.append('<div class="arrow-left"><span class="arrow"></span></div>');
            wrapper.append('<div class="image"><img src=""/></div>');  
            wrapper.append('<div class="arrow-right"><span class="arrow"></span></div>'); 
            wrapper.append('<div class="info"><p class="img_name"></p><ul class="exif"></ul><p class="img_desc"></p></div>');  
            
            var Browser = function(){
                this.navPrev = wrapper.find('.arrow-left'); 
                this.navNext = wrapper.find('.arrow-right'); 
                this.arrow = wrapper.find('.arrow');
                this.imgDiv = wrapper.find('.image');
                this.img = wrapper.find('.image img');
                this.info = wrapper.find('.info');
                this.name = wrapper.find('.img_name');
                this.desc = wrapper.find('.img_desc');
                this.exif = wrapper.find('.exif');
                this.closeButton = wrapper.find('.close');
                var helper = this;
                var preloader = new Image();                     
                
                this.hideNav = function(){ // Hide navigation buttons
                    this.arrow.hide();
                    this.closeButton.hide();
                }
                
                this.showNav = function(id){ // Show navigation buttons
                    this.arrow.show();
                    this.closeButton.show();
                    
                    this.navPrev.show();
                    this.navNext.show();
                    if(id == 1) this.navPrev.hide();
                    if(id == count-1) this.navNext.hide();
                }
                
                this.showExif = function(tags){ // Show basic image exif information
                    this.exif.empty();
                    this.exif.append('<li>Camera used: ' + tags.Make + ' ' + tags.Model + '</li>');
                    var time = tags.ExposureTime;
                    if(tags.ExposureTime < 1) time = '1/' + 1/tags.ExposureTime;
                    this.exif.append('<li>Exposure time: ' + time + ' s</li>');
                    this.exif.append('<li>Aperture: f/' + tags.FNumber.toFixed(1) + '</li>');
                    this.exif.append('<li>Focal length: ' + tags.FocalLength + ' mm</li>');
                    this.exif.append('<li>ISO: ' + tags.PhotographicSensitivity + '</li>');
                    var d = tags.DateTimeOriginal.split(' ');
                    var d_global = d[0].split(':');
                    var d_local = d[1].split(':');
                    this.exif.append('<li>Date taken: ' + d_global[2] + '. ' + d_global[1] + '. ' + d_global[0] + ', ' + d_local[0] + ':' + d_local[1] + '</li>');
                }
                
                this.preload = function(id){ // Preload image by id
                    if(id < 1 || id >= count) return;
                    var img = imgs_container[id]; 
                    preloader.src = img.tgt;
                }
                
                this.resizeImage = function(){ // Resize contents default version  
                    CB.removeClass("mobile");  
                    this.arrow.css("top", "calc(50% - 20px)");
                    this.closeButton.css("top", "15px"); 
                    this.img.css("height", "auto");
                    this.info.css("max-width", "1024px");
                    
                    var infoH = this.info.outerHeight() + 15;                    
                    var h = "calc(100% - "+ infoH +"px)";  
                    this.imgDiv.css("max-height", h);  
                    if(this.img.height() > this.imgDiv.height()) this.img.css("height", this.imgDiv.height());
                    
                    // info full width when horizontal 
                    if(this.img.height() > this.img.width()) this.info.css("max-width", "1024px");
                    else this.info.css("max-width", this.img.width() + "px");  
                }
                
                this.resizeMobile = function(){ // Resize contents mobile version
                    CB.addClass("mobile"); 
                    this.img.css("height", "auto");
                    this.arrow.css("top", this.img.height());
                    this.closeButton.css("top", this.img.height());
                }
                
                this.alterURL = function(id, clear = false){ // Alter URL to allow linking to images
                    if(opt.alterUrlFlag == true){
                        var url = $(location).attr('href'); 
                        var urlArr = url.split('/');
    
                        if(clear == true){
                          if (urlArr[urlArr.length-1].match("^" + opt.alterUrlString)) {
                              urlArr[urlArr.length-1] = '';
                          }
                        }else{
                          urlArr[urlArr.length-1] = opt.alterUrlString + id;
                        }   
                        var newURL = urlArr.join('/');
                        history.replaceState('', this.img.name, newURL);
                    }
                }
                
                this.showImage = function(id){ // Show image by id              
                    var tmp = this; 
                    wrapper.css("display", "block");
                    var img = imgs_container[id];   
                    this.img.attr("src", "/img/spinner.gif");
                    this.hideNav();
                    this.desc.html(img.caption);   
                    this.alterURL(id, false);                 
                    
                    var loader = new Image();
                    loader.src = img.tgt;
                    loader.onload = function(){                          
                        tmp.img.attr("src", loader.src);
                        
                        if(opt.showExif){
                          var exif = new Exif(this, {
                            done: function(tags) {
                              helper.showExif(tags);
                            }
                          });
                        }
                        tmp.showNav(id);   
                        if(!mobile) helper.resizeImage();
                        else helper.resizeMobile();  
                    };
                };
                
                this.next = function(){ // Show next image                       
                    if(pos_id == count-1) return;
                    ++pos_id;                     
                    this.showImage(pos_id);
                    this.preload(pos_id+1);
                };
                
                this.prev = function(){ // Show previous image                        
                    if(pos_id == 1) return;
                    --pos_id;
                    this.showImage(pos_id);
                    this.preload(pos_id-1);
                };
                
                this.close = function(){ // Close browser window
                    CB.css("display", "none");  
                    this.img.attr("src", "/img/spinner.gif");
                    this.imgDiv.css("max-height", "100%");  
                    var img = document.getElementById('ci_'+ pos_id);
                    this.alterURL('', true);  
                    if(opt.scrollBack) img.scrollIntoView(true);
                }
                
                this.init = function(){ // Init browser, read image parameters  
                    CB.addClass('captionBox');                
                    $(opt.imageSelector).each(function(i, obj) {
                        var pos = i; ++pos;
                        $(this).attr('id', 'ci_' + pos);
                        var item = {    
                                    tgt: $(this).attr('href'),
                                    caption: $(this).children('.customCaption').clone()
                                   }
                        imgs_container.push(item);
                        count = imgs_container.length;                         
                    });   
                    
                    if(opt.swipeNav) this.initMobile();
                    if(opt.disableRightClick){
                      CB.add('.captionBoxImage').on("contextmenu", "img", function(e) {
                        return false;
                      });
                    }
                    
                    // check URL if any image should be enlarged
                    if(opt.alterUrlFlag == true){ 
                      var url = $(location).attr('href'); 
                      var urlArr = url.split('/');                      
                    
                      if (urlArr[urlArr.length-1].match("^" + opt.alterUrlString)) {
                        pos_id = parseInt(urlArr[urlArr.length-1].replace(/[^0-9\.]/g, ''), 10);                   
                        this.showImage(pos_id);
                        browser.preload(pos_id-1);
                        browser.preload(pos_id+1);
                      }  
                    }              
                };
                
                this.initMobile = function(){ // load jquery mobile
                    var tmp = this;
                    $("a").attr("data-ajax", "false"); 
                    $.getScript("http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js", function(){
                        CB.on("swipeleft", function(e){
                            tmp.next(); 
                        });
                        CB.on("swiperight", function(e){
                            tmp.prev(); 
                        });
                    });
                }                 
            };
              
            var browser = new Browser();  // Image browser
            browser.init();
                
            browser.navNext.click(function(e){ // Click next button
                e.preventDefault();
                browser.next(); 
            });              
            browser.navPrev.click(function(e){ // Click previous button
                e.preventDefault();
                browser.prev();
            });               
            browser.closeButton.click(function(e){ // Click close button
                e.preventDefault();
                browser.close();
            });   
            $(opt.imageSelector).click(function(e){ // Click on thumbnail
                e.preventDefault();
                var id = $(this).attr('id').split("_").pop();
                pos_id = id;
                browser.showImage(id);
                browser.preload(pos_id-1);
                browser.preload(pos_id+1);
            });
            $(document).keydown(function(e) { // Keypress event
                if(e.which == 37) {
                  browser.prev();
                }else if(e.which == 39){
                  browser.next(); 
                }else if(e.which == 27){
                  browser.close(); 
                }
            });
            $(window).on('resize', function(){ // maintain correct dimensions
                  var win = $(this); //this = window
                  mobile = (win.width() < opt.mobileWidth) ? true : false;
                  if(!mobile) browser.resizeImage();
                  else browser.resizeMobile();  
            });
        });    
    };
})(jQuery);
