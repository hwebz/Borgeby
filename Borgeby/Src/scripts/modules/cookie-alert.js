/*------------------------------------*\
    #COOKIE-ALERT
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Cookie alert module
 */
emptyepi.modules.cookieAlert = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
        priv.verifyCookieAcceptance();
    };


    /**
     * Bind events
     */
    priv.bindEvents = function () {
        $(".js-accept-cookies").on("click", function () {
            emptyepi.modules.cookies.set("cookiesAccepted", true, 365);
            priv.verifyCookieAcceptance();
        });
    };


    /**
     * Verify cookie acceptance
     */
    priv.verifyCookieAcceptance = function () {
        if (emptyepi.modules.cookies.get("cookiesAccepted"))
            priv.hideCookieInformation();
        else
            priv.showCookieInformation();
    };


    /**
     * Hide cookie information
     */
    priv.hideCookieInformation = function () {
        if ($(".cookie-information").is(":visible")) {
            emptyepi.modules.common.hideContent(".cookie-information");
        }
    };


    /**
     * Show cookie information
     */
    priv.showCookieInformation = function () {
        $(".cookie-information").show();
    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();
