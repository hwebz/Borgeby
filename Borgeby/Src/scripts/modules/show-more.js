/*------------------------------------*\
    #SHOW-MORE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Module for showing more (hidden) data
 */
emptyepi.modules.showMore = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {

        /**
         * Initialize all load more's
         */
        $(".js-show-more").each(function () {
            var target = $(this).data("target");
            var targetItems = $(this).data("target-items");
            var itemsVisible = $(target).data("visible");
            var itemsTotal = $(target).find(targetItems).length;

            // Check if there are more items to show
            if (itemsVisible < itemsTotal) {

                // Loop through all items
                $(target).find(targetItems).each(function (index) {

                    // Check if the current item should be hidden
                    if (index >= itemsVisible) {
                        $(this).removeClass("is-visible");
                    }

                });

                // Show trigger
                $(this).addClass("is-visible");
            }

        });


        /**
         * Click handler for loading more data
         */
        $(".js-show-more").on("click", function () {
            var target = $(this).data("target");
            var targetItems = $(this).data("target-items");
            var itemsTotal = $(target).find(targetItems).length;
            var itemsVisible = $(target).data("visible");

            var step = $(target).data("step");
            // Increase items visible with step number
            itemsVisible = parseInt(itemsVisible) + parseInt(step);

            // Loop through all items that are not already visible
            $(target).find(targetItems).not(".is-visible").each(function (index) {

                // When we have shown the number of new items as defined in `step`, we exit the each loop
                if (index >= step)
                    return false;

                // Show item
                $(this).addClass("is-visible");

                // Continue each loop
                return true;

            });

            // Update visible count attribute
            $(target).data("visible", itemsVisible);

            // Check if trigger element should be hidden
            if (itemsVisible >= itemsTotal) {
                $(this).removeClass("is-visible");
            }
        });

    };



    // Initialize module
    $(function () {
        priv.init();
    });

})();
