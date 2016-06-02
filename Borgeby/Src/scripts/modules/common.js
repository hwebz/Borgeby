/*------------------------------------*\
    #COMMON
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Common methods module
 */
emptyepi.modules.common = (function () {
    var pub = {};


    /**
     * Fade away content
     * @param {jQuery} element
     */
    pub.hideContent = function (element) {
        $(element).animate({
            opacity: "0"
        }, 300, function () {
            $(this).slideUp(300);
        });
    };


    // Expose the public methods
    return pub;
})();
