/*------------------------------------*\
    #TOGGLE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Toggle module
 */
borgeby.modules.toggle = (function () {
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
        $(".js-toggle").on("click", function (e) {
            e.preventDefault();
            var target = $(this).data("target");

            // Create jQuery object of target
            target = $(target);

            if (target.is(":visible")) {
                target.slideUp(200);
            } else {
                target.slideDown(200);
            }

            $(".nav__image--service-selector").toggleClass("is-active");
        });
    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();
