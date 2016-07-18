var slider = null;

$(function () {
    
    //Nav Stop Cat navigation:
    $(".navbar-default a").each(function (index, ele) {
        var $li = $(ele).parent('li');
        if ($li.length > 0 && $li.hasClass("menu-item-object-category")) {
            $(ele).attr("href", "#");
        }
    });
    
    //Nav Mobile Collapse:
    $(".navbar-default .toggle-menu-sub").click(function (event) {
        if (!$('nav .navbar-toggle').is(":visible")) { return; }
        if (event.target !== this && $(event.target).attr("href") !== "#") { return; }
        event.preventDefault();
        var $this = $(this);
        var $menu = $this.find('ul').eq(0);
        if ($menu.length > 0) {
            if ($menu.is(":visible")) {
                $menu.slideUp("fast");
                $this.removeClass("open-sub").addClass("closed-sub");
            } else {
                $menu.slideDown("fast");
                $this.removeClass("closed-sub").addClass("open-sub");
            }
        }
        return false;
    });
    
    //Nav Left Side Flat Same level:
    $("#thomps-parent-nav").each(function (index, ele) {
        var $menu = $(ele);
        var $page = $menu.find('.current_page_item.active').eq(0),
            $tolist = [];
        if ($page.length > 0) {
            $tolist = $page.closest('ul').children('li.menu-item');
            $menu.html("");
            $tolist.each(function (ind, el) {
                if (!$(el).hasClass('menu-item-object-category')) {
                    $menu.append($(el));
                }
            });
            $menu.find('ul').remove();
            $menu.slideDown("fast");
        }
    });
    
    //Nav Left Side Flat Childrens:
    $("#thomps-child-nav").each(function (index, ele) {
        var $menu = $(ele);
        var $page = $menu.find('.current_page_item.active').eq(0),
            $tolist = [];
        if ($page.length > 0) {
            $tolist = $page.children('ul').children('li.menu-item');
            $menu.html("");
            $tolist.each(function (ind, el) {
                if (!$(el).hasClass('menu-item-object-category')) {
                    $menu.append($(el));
                }
            });
            $menu.find('ul').remove();
            $menu.slideDown("fast");
        }
    });
    
    //Top slider.
    slider = {
        allowNav : true,
        set : {
            slideSpeed : 500,
            inactiveClass : "darker"
        },
        main : $("#tc_slider_head"),
        con : $("#tc_slider_head").parent("div"),
        controls: { left: $("#tc_slide_left"), right: $("#tc_slide_right") },
        slides : [],
        posAt: 0,
        newShiftOrder : function(side) {
            var numOfSlides = slider.slides.length,
                elMove = null,
                pos = parseInt(slider.main.css("left"));
            if (side === "left") {
                elMove = slider.slides[numOfSlides-1].clone(true, true);
                pos -= slider.slides[numOfSlides-1].outerWidth() + 8;
                elMove.addClass(slider.set.inactiveClass);
                slider.main.css({ left : pos }).prepend(elMove);
                slider.slides = slider.prepend(elMove, slider.slides);
                slider.posAt++;
            } else {
                elMove = slider.slides[0].clone(true, true);
                elMove.addClass(slider.set.inactiveClass);
                slider.main.append(elMove);
                slider.slides = slider.append(elMove, slider.slides);
            }
        },
        calcPos: function (at) {
            if (at === 0) { return 0; }
            var sizeSlide = slider.slides[at].outerWidth() + 8,
                sizeCon = slider.main.outerWidth(),
                pos = 0;
            if (at === slider.slides.length - 1) {
                pos = (sizeSlide * at) - Math.ceil((sizeCon - sizeSlide));
            } else {
                pos = (sizeSlide * at) - Math.ceil((sizeCon - sizeSlide) / 2);
            }
            return pos * -1;
        },
        append :function (value, array) {
          var newArray = array.slice(0);
          newArray.push(value);
          return newArray;
        },
        prepend :function (value, array) {
          var newArray = array.slice(0);
          newArray.unshift(value);
          return newArray;
        }
    };
    if (slider.main.length) {
        slider.main.children('li').each(function (index, ele) {
            slider.slides.push($(ele));
        });
        if (slider.slides.length > 0) {
            slider.posAt = Math.ceil((slider.slides.length - 1) / 2);
            
            //Show controls:
            
            //Set styles:
            $.each(slider.slides, function (index, ele) {
                if (index !== slider.posAt) {
                    ele.addClass(slider.set.inactiveClass);
                } else {
                    ele.removeClass(slider.set.inactiveClass);
                }
            });
            
            //Set starting:
            slider.main.css({ left : slider.calcPos(slider.posAt) });
            
            //attach controls:
            slider.controls.left.click(function() {
                var pos = 0;
                if (!slider.allowNav) { return; }
                slider.allowNav = false;
                if (slider.posAt > 1) {
                    slider.posAt--;
                    pos = slider.calcPos(slider.posAt);
                    slider.main.animate({ left : pos }, slider.set.slideSpeed, function(){
                        slider.allowNav = true;
                    });
                    slider.slides[slider.posAt].removeClass(slider.set.inactiveClass);
                    slider.slides[slider.posAt+1].addClass(slider.set.inactiveClass);
                } else {
                    slider.posAt--;
                    slider.newShiftOrder("left");
                    pos = slider.calcPos(slider.posAt);
                    slider.main.animate({ left : pos },  slider.set.slideSpeed,function() {
                        slider.slides[slider.slides.length - 1].remove();
                        slider.slides.pop();
                        slider.allowNav = true;
                    });
                    slider.slides[slider.posAt].removeClass(slider.set.inactiveClass);
                    slider.slides[slider.posAt+1].addClass(slider.set.inactiveClass);
                }
            });
            slider.controls.right.click(function() {
                var pos = 0;
                if (!slider.allowNav) { return; }
                slider.allowNav = false;
                if (slider.posAt < slider.slides.length - 2) {
                    slider.posAt++;
                    pos = slider.calcPos(slider.posAt);
                    slider.main.animate({ left : pos },  slider.set.slideSpeed, function(){
                        slider.allowNav = true;
                    });
                    slider.slides[slider.posAt].removeClass(slider.set.inactiveClass);
                    slider.slides[slider.posAt-1].addClass(slider.set.inactiveClass);
                } else {
                    slider.posAt++;
                    slider.newShiftOrder("right");
                    pos = slider.calcPos(slider.posAt);
                    slider.main.animate({ left : pos },  slider.set.slideSpeed, function() {
                        var remLeft = slider.slides[0].outerWidth() + 8;
                        slider.slides[0].remove();
                        slider.main.css({ left : parseInt(slider.main.css("left")) + remLeft });
                        slider.slides.shift();
                        slider.posAt--;
                        slider.allowNav = true;
                    });
                    slider.slides[slider.posAt].removeClass(slider.set.inactiveClass);
                    slider.slides[slider.posAt-1].addClass(slider.set.inactiveClass);
                }
            });
        }
    }
});