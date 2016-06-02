/*------------------------------------*\
    #RESPONSIVE-BG-IMAGE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Responsive background image
 */
emptyepi.modules.responsiveBgImage = (function () {
    var priv = {};
    var browserWidth;
    var cssBackgroundImage;
    var resizeTimer;


    /**
     * Private initialization method
     */
    priv.init = function () {
        browserWidth = $(window).width();

        priv.bindEvents();
        priv.refreshBackgroundImage();
    }


    /**
     * Bind events
     */
    priv.bindEvents = function () {

        /**
         * Window resize
         */
        $(window).on("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                priv.resize();
            }, 100);
        });

    };


    /**
     * Resize browser
     */
    priv.resize = function() {
        var isInEditMode = $("html").hasClass("edit-mode");
        var newBrowserWidth = $(window).width();
        var hasResizedHorizontally = newBrowserWidth !== browserWidth;

        // Do nothing if browser width hasn't changed
        if (!hasResizedHorizontally)
            return;

        // If width has changed, update global variable
        browserWidth = newBrowserWidth;

        // If NOT in EPiServer edit mode, change background image
        if (!isInEditMode)
            priv.refreshBackgroundImage();
    };


    /**
     * Refresh background image
     */
    priv.refreshBackgroundImage = function () {

        /**
         * Loop through all elements with responsive background image functionality
         */
        $(".js-responsive-bg-image").each(function () {

            // Get image URLs for breakpoints
            var bgMobile = $(this).data("bg-mobile");
            var bgTablet = $(this).data("bg-tablet");
            var bgDesktop = $(this).data("bg-desktop");

            // Get current CSS background image
            cssBackgroundImage = $(this).css("background-image");

            // Check which background image that should be used
            if (emptyepi.modules.browserWidth.isMobile() && bgMobile !== undefined && !priv.isBackgroundImageSet(bgMobile)) {
                // Mobile
                priv.setBackgroundImage(this, bgMobile);
            } else if (emptyepi.modules.browserWidth.isTablet() && bgTablet !== undefined && !priv.isBackgroundImageSet(bgTablet)) {
                // Tablet
                priv.setBackgroundImage(this, bgTablet);
            } else if (
                (emptyepi.modules.browserWidth.isDesktop() && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) ||
                (emptyepi.modules.browserWidth.isMobile() && bgMobile === undefined && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) ||
                (emptyepi.modules.browserWidth.isTablet() && bgTablet === undefined) && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) {
                // Desktop
                priv.setBackgroundImage(this, bgDesktop);
            }

        });

    };


    /**
     * Get CSS formatted background image url
     * @param {string} imageUrl
     * @returns {string}
     */
    priv.getBackgroundImageUrl = function (imageUrl) {
        var cssUrl = "url(" + imageUrl + ")";
        return cssUrl;
    };


    /**
     * Set CSS background image
     * @param {string} imageUrl
     */
    priv.setBackgroundImage = function (element, imageUrl) {
        $(element).css("background-image", priv.getBackgroundImageUrl(imageUrl));
    };


    /**
     * Check if background image is set
     * @param {string} imageUrl
     * @returns {boolean}
     */
    priv.isBackgroundImageSet = function (imageUrl) {
        return cssBackgroundImage.indexOf(imageUrl) !== -1;
    };


    // Initialize private methods
    $(function () {
        priv.init();
    });

})();
