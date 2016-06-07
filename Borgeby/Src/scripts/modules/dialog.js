/*------------------------------------*\
    #DIALOG
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Dialog module
 */
borgeby.modules.dialog = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
    }


    /**
     * Bind events
     */
    priv.bindEvents = function () {

        /**
         * Click on collapse control
         */
        $(".js-dialog").on("click", function (event) {
            var dialogId = $(this).data("dialog");
            var dialogEl = document.getElementById(dialogId);
            var dialog = new A11yDialog(dialogEl);

            // Prevent default link behaviour
            event.preventDefault();

            // Show dialog
            dialog.show();

        });

    };


    // Initialize private methods
    $(function () {
        priv.init();
    });
})();
