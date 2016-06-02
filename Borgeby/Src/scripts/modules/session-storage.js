/*------------------------------------*\
    #SESSION-STORAGE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Session storage module
 */
emptyepi.modules.sessionStorage = (function () {
    var pub = {};


    /**
     * Get session storage item
     * @param {string} name
     * @returns {string} The value of the session storage item, or null if not found
     */
    pub.get = function (name) {
        return sessionStorage.getItem(name);
    };


    /**
     * Set session storage item
     * @param {string} alertId
     * @param {string} value
     */
    pub.set = function (name, value) {
        sessionStorage.setItem(name, value);
    };


    // Expose public methods
    return pub;
})();
