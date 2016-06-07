/*------------------------------------*\
    #COMMON
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Common methods module
 */
borgeby.modules.common = (function () {
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
