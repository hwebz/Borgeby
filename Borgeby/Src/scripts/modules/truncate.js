/*------------------------------------*\
    #TRUNCATE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Truncate text module
 */
borgeby.modules.truncate = (function () {
    var priv = {};
    var resizeTimer;


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
        priv.truncate();
    };


    /**
     * Bind events
     */
    priv.bindEvents = function () {

        /**
         * Window resize
         */
        $(window).on("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                priv.resize();
            }, 100);
        });

    };


    /**
     * Resize browser
     */
    priv.resize = function () {
        // Re-truncate on window resize. Will only truncate when window is resized smaller.
        priv.truncate();
    };


    /**
     * Truncate
     */
    priv.truncate = function () {

        $(".js-truncate").each(function () {
            var truncate = $(this);
            var textWidth = truncate.width();
            var fontSize = truncate.css("font-size");
            var letterWidth = parseInt(fontSize, 10) / 1.8;
            var rows = truncate.data("rows");
            var truncateSize = Math.floor((textWidth / letterWidth) * rows);
            var truncateContent = truncate.find(".js-truncate-content");

            // Check if truncate element have child element that should be truncated instead
            if (truncateContent.length)
                truncate = truncateContent;

            truncate.succinct({
                size: truncateSize,
                omission: "\u2026"
            });
        });

    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();
