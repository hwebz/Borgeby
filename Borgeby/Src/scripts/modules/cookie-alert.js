/*------------------------------------*\
    #COOKIE-ALERT
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Cookie alert module
 */
borgeby.modules.cookieAlert = (function () {
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
            borgeby.modules.cookies.set("cookiesAccepted", true, 365);
            priv.verifyCookieAcceptance();
        });
    };


    /**
     * Verify cookie acceptance
     */
    priv.verifyCookieAcceptance = function () {
        if (borgeby.modules.cookies.get("cookiesAccepted"))
            priv.hideCookieInformation();
        else
            priv.showCookieInformation();
    };


    /**
     * Hide cookie information
     */
    priv.hideCookieInformation = function () {
        if ($(".cookie-information").is(":visible")) {
            borgeby.modules.common.hideContent(".cookie-information");
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
