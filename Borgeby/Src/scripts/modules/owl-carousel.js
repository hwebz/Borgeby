/*------------------------------------*\
    #OWL-CAROUSEL
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Owl carousel module
 */
emptyepi.modules.owlCarousel = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
    };


    /**
     * Bind events
     */
    priv.bindEvents = function () {



        // Initialize all carousels
        $(".owl-carousel").owlCarousel({
            items: 1,
            nav: true,
            loop: true,
            navText: [
                "<span aria-hidden='true'>&lt;</span><span class='sr-only'>Föregående bild</span>",
                "<span aria-hidden='true'>&gt;</span><span class='sr-only'>Nästa bild</span>"
            ]
        });

        // Carousel focus
        $(".owl-carousel").on("keyup", function (event) {

            // handle cursor keys
            if (event.keyCode === 37) {
                // go left
                $(this).trigger("prev.owl.carousel");
            } else if (event.keyCode === 39) {
                // go right
                $(this).trigger("next.owl.carousel");
            }

        });

    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();

