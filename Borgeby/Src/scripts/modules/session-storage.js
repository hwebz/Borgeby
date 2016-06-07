/*------------------------------------*\
    #SESSION-STORAGE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Session storage module
 */
borgeby.modules.sessionStorage = (function () {
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
