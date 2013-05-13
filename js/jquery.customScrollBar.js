/*

  jquery.customScrollBar by Gregor Adams aka. Pixelass.
  ©2013 by Pixelass

  a plugin to create a custom scrollbar that allows css styling

  This plugin handles the idea differently than other plugins. There is
  no use of the mousewheel (scrollwheel) plugin.

  it translates the native scroll and therefore aims to deliver an
  experience as close to the nazive behaviour as possible

  Licensed under the MIT license: http://opensource.org/licenses/MIT
*/

(function ($) {
    $.fn.customScrollBar = function (options) {
        // set some default options
         $(this).each(function (){
       var defaults = {
            // no options yet
        };
        // extend the options
        options = $.extend(defaults, options);

        // set the variables
        var thisElement = $(this);
        var $body = $('body');
        // for later use
        var clickY = 0;
        var $dragging = null;
        var scrollTriggerFunction;
        var deltaY;
        var clickYY;

        // wrap our element
        thisElement.wrap('<div class=\"scroll-wrapper\" >');
        thisElement.wrap('<div class=\"scroll-area\" >');
        // get new elements and dependant calculations
        var $scrollArea = thisElement.parent();
        var $scrollWrapper = $scrollArea.parent();
        var thisHeight = parseInt((thisElement.outerHeight()),10);
        var scrollAreaHeight = parseInt(($scrollArea.outerHeight()),10);
        var thisScroll = parseInt(($scrollArea.scrollTop()),10);


        // the factor will be used for calculating the relation between
        // our events and elements
        var factor = thisHeight / scrollAreaHeight;
        var scrollBarHeight = scrollAreaHeight / factor;
        var newScrollBar = '<div class=\"scroll-track\">'
            + '<span class=\"scroll-trigger top\"/>'
            + '<div class=\"scroll-bar\"/>'
            + '<span class=\"scroll-trigger bottom\"/></div> ';
        // add the scrollbar
        if (thisHeight > scrollAreaHeight){
            $scrollArea.parent().append(newScrollBar);
        }
        // get new elements and dependants
        var $scrollBar = $scrollWrapper.find('.scroll-bar');
        var $scrollTriggerTop =  $scrollWrapper.find('.scroll-trigger.top');
        var $scrollTriggerBottom =  $scrollWrapper.find('.scroll-trigger.bottom');
        var thisMargin = parseInt(($scrollBar.css('margin-top')),10) * 2;

        // make sure our scrollbar is visible
        if (scrollBarHeight < 64){
            scrollBarHeight = 64;
        }

        // set the height of the scrollbar
        $scrollBar.css({
            height: scrollBarHeight - thisMargin
        });
        // handling the native mouse scroll
        $scrollArea.on('scroll', function (){
            var $this = $(this);
            thisScroll = parseInt(($this.scrollTop()),10);


            $scrollBar.css({
                top: thisScroll / factor
            });

        });
        thisElement.parent().parent().on('mousedown', '.scroll-track', function (e){
            var $this = $(this);
            var thisOffset =  parseInt(($this.offset().top),10);
            var trackOffset =  parseInt(($this.find('.scroll-bar').position().top),10);
            var trackPosition =  $this.find('.scroll-bar').position().top / scrollBarHeight;
            var correctOffset = e.pageY - thisOffset - trackOffset;
            // prevent the cursor from changing to text-input
            e.preventDefault();
            // calculate the correct offset
            clickY = thisOffset + correctOffset;
            clickYY = thisOffset + thisMargin;
            if ($( e.target).hasClass('scroll-bar')) {
                $dragging = $(e.target);
            }
            //console.log(thisOffset, trackPosition, trackOffset, correctOffset, clickY, clickYY);

        })
        // scroll to position if the track is clicked (but prevent
        // when triggers or the bar is clicked)
            .on('mousedown', '.scroll-track', function (e){
                if (!$( e.target).hasClass('scroll-trigger') && !$( e.target).hasClass('scroll-bar')) {
                    deltaY = e.pageY - clickYY;
                    $scrollArea.stop(true,true).animate({scrollTop: deltaY * factor},1);
                }
            });


        // scrolling via the triggers (up-down-arrows)
        // Top arrow
        $scrollTriggerTop.on('mousedown', function (){
            $scrollArea.stop(true,true).animate({scrollTop: "-=" + factor + "px"},factor);
            scrollTriggerFunction = setInterval(function (){
                $scrollArea.stop(true,true).animate({scrollTop: "-=" + factor + "px"},factor);
            },1);
        });
        // Bottom arrow
        $scrollTriggerBottom.on('mousedown', function (){
            $scrollArea.stop(true,true).animate({scrollTop: "+=" + factor + "px"},factor);
            scrollTriggerFunction = setInterval(function (){
                $scrollArea.stop(true,true).animate({scrollTop:  "+=" + factor + "px"},factor);
            },1);
        });

        // on mouseup or mouseleave we will kill all intervals and set
        // dragging to null to prevent leaking
        $body.on('mouseup mouseleave', function (){
            clearInterval(scrollTriggerFunction);
            $dragging = null;
        })
        // on mosemove we will move our scrollbar if dragging is
        // active (after mousedown on scroll-track)
            .on('mousemove', function (e){
                if ($dragging) {
                    deltaY = e.pageY - clickY ;
                    $scrollArea.stop(true,true).animate({scrollTop: deltaY * factor},factor);
                }
            });
        });

    };
})(jQuery);
