/*------------------------------------*\
    #COOKIES
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Cookie handling module
 */
borgeby.modules.cookies = (function () {
    var pub = {};


    /**
     * Get cookie
     * @param {string} name
     * @returns {string} The value of the cookie, or null if not found
     */
    pub.get = function (name) {
        var nameEq = name + "=";
        var storedCookies = document.cookie.split(";");

        for (var i = 0; i < storedCookies.length; i++) {
            var cookie = storedCookies[i];

            while (cookie.charAt(0) === " ")
                cookie = cookie.substring(1);

            if (cookie.indexOf(nameEq) !== -1)
                return cookie.substring(nameEq.length, cookie.length);
        }

        return null;
    };


    /**
     * Set cookie
     * @param {string} name
     * @param {string} value
     * @param {number} expirationDays
     */
    pub.set = function (name, value, expirationDays) {
        var date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));  // {days} * 24h * 60min * 60sec * 1000ms
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
    };


    // Expose public methods
    return pub;

})();
