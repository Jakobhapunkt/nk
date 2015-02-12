$(document).ready(function($) {
    var o, elm, it, features, fn, handlers;

    o = {
        slide_speed: 900 // matches value in style.less
    };

    elm = {
        win: $(window),
        body: $('body'),
        hero: $('.hero'),

        nav: $('.nav'),
        nav_links: $('.nav a'),

        carousel: $('.page-carousel'),
        track: $('.page-carousel .track'),
        slides: $('.page-carousel .slide')
    };

    it = {
        win_height: elm.win.height(),
        win_width:  elm.win.width(),

        current_slide: 0
    };

    features = {
        can_touch: (!!('ontouchstart' in window) || !!('onmsgesturechange' in window) ? true : false),
        transform3d: (function() {
            if (!window.getComputedStyle) { return false; }

            var el = document.createElement('p'), has3d, transforms = {'webkitTransform':'-webkit-transform', 'OTransform':'-o-transform', 'msTransform':'-ms-transform', 'MozTransform':'-moz-transform', 'transform':'transform' };

            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }())
    };

    fn = {
        init: function(){
            if (features.can_touch) {
                elm.body.addClass('feature-touch');
            }

            fn.size_carousel();

            fn.goto_slide(0);

            elm.nav_links.on('click', handlers.nav_link_click);
            elm.win.on('resize', handlers.resize);
        },
        size_carousel: function(){
            elm.slides.css({
                'width':      it.win_width + 'px',
                'min-height': it.win_height + 'px'
            });
        },
        goto_slide: function(num) {
            var current_slide = elm.slides.eq(num);
            var shift_left = -1 * num * it.win_width;

            // set classes
            elm.body.addClass('transitioning');
            elm.slides.removeClass('current');
            current_slide.addClass('current');

            setTimeout(function(){elm.body.removeClass('transitioning');}, o.slide_speed);

            if (current_slide.data('invert')) {
                elm.body.addClass('invert');
            } else {
                elm.body.removeClass('invert');
            }

            // set bg color
            elm.body.removeClass(function(index, css) {
                return (css.match (/\bbg-\S+/g) || []).join(' ');
            });
            if (current_slide.data('bg')) {
                elm.body.addClass('bg-' + current_slide.data('bg'));
            }

            // move track
            

            if (features.transform3d) {
                elm.track.css({
                    '-webkit-transform': 'translate3d('+shift_left+'px, 0, 0)',
                    '-moz-transform':    'translate3d('+shift_left+'px, 0, 0)',
                    '-ms-transform':     'translate3d('+shift_left+'px, 0, 0)',
                    '-o-transform':      'translate3d('+shift_left+'px, 0, 0)',
                    'transform':         'translate3d('+shift_left+'px, 0, 0)'
                });
            } else {
                elm.track.css('left', shift_left);
            }

            // set slide height
            elm.carousel.css('height', current_slide.height());
            
            it.current_slide = num;
        }
    };


    handlers = {
        resize: function(){
            it.win_height = elm.win.height();
            it.win_width =  elm.win.width();

            fn.size_carousel();
            fn.goto_slide(it.current_slide);
        },
        nav_link_click: function(){
            var link = $(this);

            elm.nav_links.removeClass('current');
            link.addClass('current');

            fn.goto_slide(link.data('num'));
        }
    };

    fn.init();
});