/*------------------------------------*\
    #BROWSER-WIDTH
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Browser width
 */
borgeby.modules.browserWidth = (function () {
    var pub = {};
    var browserWidth;
    var scrollbarWidth = 18;
    var breakpoint = {
        tabletStart: 768,
        desktopStart: 1024
    };


    /**
     * Check if we are in mobile breakpoint
     * @returns {boolean}
     */
    pub.isMobile = function () {
        browserWidth = $(window).width();
        return browserWidth < breakpoint.tabletStart - scrollbarWidth;
    };


    /**
     * Check if we are in tablet breakpoint
     * @returns {boolean}
     */
    pub.isTablet = function () {
        browserWidth = $(window).width();
        return (browserWidth >= breakpoint.tabletStart - scrollbarWidth) && (browserWidth < breakpoint.desktopStart - scrollbarWidth);
    };


    /**
     * Check if we are in desktop breakpoint
     * @returns {boolean}
     */
    pub.isDesktop = function () {
        browserWidth = $(window).width();
        return browserWidth >= breakpoint.desktopStart - scrollbarWidth;
    };


    // Expose public methods
    return pub;

})();
