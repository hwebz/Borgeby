/*------------------------------------*\
    #PRINT
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.seom = window.seom || {};
seom.modules = seom.modules || {};



/**
 * Print module
 */
seom.modules.print = (function () {
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
        $(".js-print").on("click", function (e) {
            e.preventDefault();
            window.print();
        });
    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();
