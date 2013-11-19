/*
 * jQuery Image Scrubber
 * From Ukiyo-e.org by John Resig <jeresig@gmail.com>
 * MIT licensed.
 */

jQuery.fn.imgScrubber = function(options) {
    options = jQuery.extend({
        scrubWait: 2000,
        resultSelector: "img",
        imgSelector: "img",
        detailsSelector: ".details",
        loadingClass: "loading-bar"
    }, options);

    jQuery(this).on({
        mouseenter: function(e) {
            var data = jQuery(this).data();

            if (data.waiting || data.loading || data.img) {
                return;
            }

            var url = jQuery(this).attr("data-url") ||
                jQuery(this).parents("a").first().attr("href");

            var $loading = jQuery("<div>")
                .addClass(options.loadingClass)
                .prependTo( jQuery(this).find(options.detailsSelector) )
                .animate({ width: "75%" }, options.scrubWait);

            data.waiting = setTimeout(function() {
                data.waiting = false;
                data.loading = true;

                $loading.animate({ width: "100%" }, options.scrubWait / 2);

                jQuery.get(url, function(html) {
                    var img = [];

                    jQuery(html).find(options.resultSelector).each(function() {
                        img.push(this.src);
                    });

                    data.img = img;
                    data.loading = false;

                    $loading
                        .stop()
                        .animate({ width: "100%" }, 300)
                        .animate({ opacity: 0 }, 300, function() {
                            $(this).remove();
                        });
                });
            }, options.scrubWait);
        },

        mouseleave: function(e) {
            var waiting = jQuery(this).data("waiting");

            if (waiting) {
                clearTimeout(waiting);
                jQuery(this).data("waiting", false);
                jQuery(this).find("." + options.loadingClass).stop().remove();
            }
        },

        mousemove: function(e) {
            var img = jQuery(this).data("img");

            if (img) {
                var pos = Math.round((e.offsetX / this.offsetWidth) * 
                    img.length);
                jQuery(this).find(options.imgSelector).attr("src", img[pos]);
            }
        }
    }, options.delegate);

    return this;
};