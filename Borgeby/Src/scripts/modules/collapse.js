/*------------------------------------*\
    #COLLAPSE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Collapse module
 */
borgeby.modules.collapse = (function () {
    var priv = {};
    var browserWidth;
    var resizeTimer;


    /**
     * Private initialization method
     */
    priv.init = function () {
        browserWidth = $(window).width();

        priv.bindEvents();
        priv.refresh();
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
            resizeTimer = setTimeout(function () {
                priv.resize();
            }, 100);
        });


        /**
         * Click on collapse control
         */
        $(".js-collapse").on("click", function (event) {
            var control = this;
            var target = $(this).data("target");
            var isDisabled = priv.isDisabled(control);
            var isExpanded = priv.isExpanded(control);

            // If collapse is disabled - use default link behaviour
            if (isDisabled)
                return;

            // If collapse is not disabled - prevent default link behaviour and use collapse function
            event.preventDefault();

            if (isExpanded)
                priv.hide(control, target);
            else
                priv.show(control, target);
        });


        /**
         * Click on collapse close button
         */
        $(".js-collapse-close").on("click", function () {
            var target = $(this).data("target");
            // Find all controls for collapse target (could be multiple)
            var controls = $(".js-collapse[data-target='" + target + "'");

            controls.each(function () {
                priv.hide(this, target);
            });
        });

    };


    /**
     * Resize browser
     */
    priv.resize = function () {
        var isInEditMode = $("html").hasClass("edit-mode");
        var newBrowserWidth = $(window).width();
        var hasResizedHorizontally = newBrowserWidth !== browserWidth;

        // Do nothing if browser width hasn't changed
        if (!hasResizedHorizontally)
            return;

        // If width has changed, update global variable
        browserWidth = newBrowserWidth;

        // If NOT in EPiServer edit mode, refresh all collapses on window resize
        if (!isInEditMode)
            priv.refresh();
    };


    /**
     * Refresh all collapses
     */
    priv.refresh = function () {
        var params = location.search;
        var hash = window.location.hash;

        // Check if parameters was provided in URL
        if (params) {
            // Split params
            params = params.substr(1).split("&");

            // Loop through all params
            for (var i = 0; i < params.length; i++) {
                // Split parameter on equal sign to extract both name and value
                var currentParam = params[i].split("=");

                // Check if param name is "id"
                if (currentParam[0] === "id") {
                    // Add expanded class to corresponding collapse control
                    $("#" + currentParam[1]).addClass("is-expanded");
                }
            }
        }

        // Check if hash is provided in URL
        if (hash) {
            // Add expanded class to collapse target (if it is found)
            $(hash).addClass("is-expanded");
        }

        /**
         * Loop through all collapses and expand the ones that should be
         */
        $(".js-collapse").each(function () {
            var control = this;
            var target = $(control).data("target");

            var isDisabled = priv.isDisabled(control);
            var isExpanded = priv.isExpanded(target);
            var shouldBeExpanded = priv.isExpanded(control);

            if ((isDisabled && !isExpanded) || (shouldBeExpanded && !isExpanded)) {
                priv.show(control, target, 0);
            } else if (!isDisabled && isExpanded) {
                priv.hide(control, target, 0);
            }
        });
    };


    /**
     * Show content
     * @param {object} control - Collapse control
     * @param {object} target - Collapse target
     * @param {number} [duration=300] - The animation duration
     */
    priv.show = function (control, target, duration) {
        if (duration === undefined)
            duration = 300;

        var isAccordion = $(control).closest(".accordion").length > 0;
        var collapseSibling = $(control).data("collapse-sibling");
        var focusElement = $(control).data("focus");

        if (isAccordion) {
            var accordion = $(control).closest(".accordion");

            // Find all collapse controls inside accordion and hide them
            $(accordion).find(".collapse__control").each(function () {
                var childControl = this;
                var childTarget = $(this).next(".collapse__target");

                priv.hide(childControl, childTarget);
            });
        }

        // Show the clicked collapse
        $(target).slideDown(duration, function () {
            // Set aria to expanded
            $(control).attr("aria-expanded", true);
            $(target).attr("aria-hidden", false);

            // Set focus if data attribute has been set
            if (focusElement)
                $(focusElement).focus();

        });

        // Add expanded class to elements
        $(control).addClass("is-expanded");
        $(target).addClass("is-expanded");
        $(control).find(".collapse__icon").addClass("is-expanded");

        // If a collapse sibling is present, add expanded class from that also
        if (collapseSibling) {
            $(control).prev(collapseSibling).addClass("is-expanded");
        }
    };


    /**
     * Hide content
     * @param {object} control - Collapse control
     * @param {object} target - Collapse target
     * @param {number} [duration=300] - The animation duration
     */
    priv.hide = function (control, target, duration) {
        if (duration === undefined)
            duration = 300;

        $(target).slideUp(duration, function () {
            // Set aria to collapsed
            $(control).attr("aria-expanded", false);
            $(target).attr("aria-hidden", true);

            // Remove expanded class from elements
            $(control).removeClass("is-expanded is-active");
            $(target).removeClass("is-expanded");
            $(control).find(".collapse__icon").removeClass("is-expanded");

            var collapseSibling = $(control).data("collapse-sibling");

            // If a collapse sibling is present, remove expanded class from that also
            if (collapseSibling) {
                $(control).prev(collapseSibling).removeClass("is-expanded is-active");
            }
        });
    };


    /**
     * Check if collapse is disabled for a collapse control
     * @param {object} control - The collapse control
     * @returns {boolean}
     */
    priv.isDisabled = function (control) {
        // We use the css attribute `content` to pass information to javascript
        // and tell the collapse module that we don't want collapse behaviour on
        // the current control in a certain breakpoint.
        return $(control).css("content") === "\"disable-collapse\"";
    };


    /**
     * Check if an element is expandeded
     * @param {object} element - The element
     * @returns {boolean}
     */
    priv.isExpanded = function (element) {
        return $(element).hasClass("is-expanded");
    };


    // Initialize private methods
    $(function () {
        priv.init();
    });
})();
