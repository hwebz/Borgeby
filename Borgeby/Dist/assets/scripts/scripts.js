/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-cookies-svg-svgasimg-addtest-fnbind-printshiv-testprop-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
   *
   * @author kangax
   * @access private
   * @function hasOwnProp
   * @param {object} object - The object to check for a property
   * @param {string} property - The property to check for
   * @returns {boolean}
   */

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    /* istanbul ignore else */
    /* we have no way of testing IE 5.5 or safari 2,
     * so just assume the else gets hit */
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  ;


   // _l tracks listeners for async tests, as well as tests that execute after the initial run
  ModernizrProto._l = {};

  /**
   * Modernizr.on is a way to listen for the completion of async tests. Being
   * asynchronous, they may not finish before your scripts run. As a result you
   * will get a possibly false negative `undefined` value.
   *
   * @memberof Modernizr
   * @name Modernizr.on
   * @access public
   * @function on
   * @param {string} feature - String name of the feature detect
   * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
   * @example
   *
   * ```js
   * Modernizr.on('flash', function( result ) {
   *   if (result) {
   *    // the browser has flash
   *   } else {
   *     // the browser does not have flash
   *   }
   * });
   * ```
   */

  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }

    // Push this test on to the listener list
    this._l[feature].push(cb);

    // If it's already been resolved, trigger it on next tick
    if (Modernizr.hasOwnProperty(feature)) {
      // Next Tick
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  /**
   * _trigger is the private function used to signal test completion and run any
   * callbacks registered through [Modernizr.on](#modernizr-on)
   *
   * @memberof Modernizr
   * @name Modernizr._trigger
   * @access private
   * @function _trigger
   * @param {string} feature - string name of the feature detect
   * @param {function|boolean} [res] - A feature detection function, or the boolean =
   * result of a feature detection function
   */

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    // Don't trigger these again
    delete this._l[feature];
  };

  /**
   * addTest allows you to define your own feature detects that are not currently
   * included in Modernizr (under the covers it's the exact same code Modernizr
   * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
   * will be added onto the Modernizr object, as well as an appropriate className set on
   * the html element when configured to do so
   *
   * @memberof Modernizr
   * @name Modernizr.addTest
   * @optionName Modernizr.addTest()
   * @optionProp addTest
   * @access public
   * @function addTest
   * @param {string|object} feature - The string name of the feature detect, or an
   * object of feature detect names and test
   * @param {function|boolean} test - Function returning true if feature is supported,
   * false if not. Otherwise a boolean representing the results of a feature detection
   * @example
   *
   * The most common way of creating your own feature detects is by calling
   * `Modernizr.addTest` with a string (preferably just lowercase, without any
   * punctuation), and a function you want executed that will return a boolean result
   *
   * ```js
   * Modernizr.addTest('itsTuesday', function() {
   *  var d = new Date();
   *  return d.getDay() === 2;
   * });
   * ```
   *
   * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
   * and to `false` every other day of the week. One thing to notice is that the names of
   * feature detect functions are always lowercased when added to the Modernizr object. That
   * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
   *
   *
   *  Since we only look at the returned value from any feature detection function,
   *  you do not need to actually use a function. For simple detections, just passing
   *  in a statement that will return a boolean value works just fine.
   *
   * ```js
   * Modernizr.addTest('hasJquery', 'jQuery' in window);
   * ```
   *
   * Just like before, when the above runs `Modernizr.hasjquery` will be true if
   * jQuery has been included on the page. Not using a function saves a small amount
   * of overhead for the browser, as well as making your code much more readable.
   *
   * Finally, you also have the ability to pass in an object of feature names and
   * their tests. This is handy if you want to add multiple detections in one go.
   * The keys should always be a string, and the value can be either a boolean or
   * function that returns a boolean.
   *
   * ```js
   * var detects = {
   *  'hasjquery': 'jQuery' in window,
   *  'itstuesday': function() {
   *    var d = new Date();
   *    return d.getDay() === 2;
   *  }
   * }
   *
   * Modernizr.addTest(detects);
   * ```
   *
   * There is really no difference between the first methods and this one, it is
   * just a convenience to let you write more readable code.
   */

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];

      // Again, we don't check for parent test existence. Get that right, though.
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }

      if (typeof last != 'undefined') {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      // Set the value (this is the magic, right here).
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        // cast to a Boolean, if not one already
        /* jshint -W053 */
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }

        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }

      // Set a single class (either `feature` or `no-feature`)
      /* jshint -W041 */
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);
      /* jshint +W041 */

      // Trigger the event
      Modernizr._trigger(feature, test);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  


/**
  * @optionName html5printshiv
  * @optionProp html5printshiv
  */

  // Take the html5 variable out of the html5shiv scope so we can return it.
  var html5;
  if (!isSVG) {

    /**
     * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
      /*jshint evil:true */
      /** version */
      var version = '3.7.3';

      /** Preset options */
      var options = window.html5 || {};

      /** Used to skip problem elements */
      var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

      /** Not all elements can be cloned in IE **/
      var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

      /** Detect whether the browser supports default html5 styles */
      var supportsHtml5Styles;

      /** Name of the expando, to work with multiple documents or to re-shiv one document */
      var expando = '_html5shiv';

      /** The id for the the documents expando */
      var expanID = 0;

      /** Cached data for each document */
      var expandoData = {};

      /** Detect whether the browser supports unknown elements */
      var supportsUnknownElements;

      (function() {
        try {
          var a = document.createElement('a');
          a.innerHTML = '<xyz></xyz>';
          //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
          supportsHtml5Styles = ('hidden' in a);

          supportsUnknownElements = a.childNodes.length == 1 || (function() {
            // assign a false positive if unable to shiv
            (document.createElement)('a');
            var frag = document.createDocumentFragment();
            return (
              typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
            );
          }());
        } catch(e) {
          // assign a false positive if detection fails => unable to shiv
          supportsHtml5Styles = true;
          supportsUnknownElements = true;
        }

      }());

      /*--------------------------------------------------------------------------*/

      /**
       * Creates a style sheet with the given CSS text and adds it to the document.
       * @private
       * @param {Document} ownerDocument The document.
       * @param {String} cssText The CSS text.
       * @returns {StyleSheet} The style element.
       */
      function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
      }

      /**
       * Returns the value of `html5.elements` as an array.
       * @private
       * @returns {Array} An array of shived element node names.
       */
      function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
      }

      /**
       * Extends the built-in list of html5 elements
       * @memberOf html5
       * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
       * @param {Document} ownerDocument The context document.
       */
      function addElements(newElements, ownerDocument) {
        var elements = html5.elements;
        if(typeof elements != 'string'){
          elements = elements.join(' ');
        }
        if(typeof newElements != 'string'){
          newElements = newElements.join(' ');
        }
        html5.elements = elements +' '+ newElements;
        shivDocument(ownerDocument);
      }

      /**
       * Returns the data associated to the given document
       * @private
       * @param {Document} ownerDocument The document.
       * @returns {Object} An object of data.
       */
      function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
          data = {};
          expanID++;
          ownerDocument[expando] = expanID;
          expandoData[expanID] = data;
        }
        return data;
      }

      /**
       * returns a shived element for the given nodeName and document
       * @memberOf html5
       * @param {String} nodeName name of the element
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived element.
       */
      function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
          ownerDocument = document;
        }
        if(supportsUnknownElements){
          return ownerDocument.createElement(nodeName);
        }
        if (!data) {
          data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
          node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
          node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
          node = data.createElem(nodeName);
        }

        // Avoid adding some elements to fragments in IE < 9 because
        // * Attributes like `name` or `type` cannot be set/changed once an element
        //   is inserted into a document/fragment
        // * Link elements with `src` attributes that are inaccessible, as with
        //   a 403 response, will cause the tab/window to crash
        // * Script elements appended to fragments will execute when their `src`
        //   or `text` property is set
        return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
      }

      /**
       * returns a shived DocumentFragment for the given document
       * @memberOf html5
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived DocumentFragment.
       */
      function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
          ownerDocument = document;
        }
        if(supportsUnknownElements){
          return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
        for(;i<l;i++){
          clone.createElement(elems[i]);
        }
        return clone;
      }

      /**
       * Shivs the `createElement` and `createDocumentFragment` methods of the document.
       * @private
       * @param {Document|DocumentFragment} ownerDocument The document.
       * @param {Object} data of the document.
       */
      function shivMethods(ownerDocument, data) {
        if (!data.cache) {
          data.cache = {};
          data.createElem = ownerDocument.createElement;
          data.createFrag = ownerDocument.createDocumentFragment;
          data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
          //abort shiv
          if (!html5.shivMethods) {
            return data.createElem(nodeName);
          }
          return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                        'var n=f.cloneNode(),c=n.createElement;' +
                                                        'h.shivMethods&&(' +
                                                        // unroll the `createElement` calls
                                                        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
          ');return n}'
                                                       )(html5, data.frag);
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Shivs the given document.
       * @memberOf html5
       * @param {Document} ownerDocument The document to shiv.
       * @returns {Document} The shived document.
       */
      function shivDocument(ownerDocument) {
        if (!ownerDocument) {
          ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
          data.hasCSS = !!addStyleSheet(ownerDocument,
                                        // corrects block display not defined in IE6/7/8/9
                                        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                        // adds styling not present in IE6/7/8/9
                                        'mark{background:#FF0;color:#000}' +
                                        // hides non-rendered elements
                                        'template{display:none}'
                                       );
        }
        if (!supportsUnknownElements) {
          shivMethods(ownerDocument, data);
        }
        return ownerDocument;
      }

      /*--------------------------------------------------------------------------*/

      /**
       * The `html5` object is exposed so that more elements can be shived and
       * existing shiving can be detected on iframes.
       * @type Object
       * @example
       *
       * // options can be changed before the script is included
       * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
       */
      var html5 = {

        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

        /**
         * current version of html5shiv
         */
        'version': version,

        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': (options.shivCSS !== false),

        /**
         * Is equal to true if a browser supports creating unknown/HTML5 elements
         * @memberOf html5
         * @type boolean
         */
        'supportsUnknownElements': supportsUnknownElements,

        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': (options.shivMethods !== false),

        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',

        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument,

        //creates a shived element
        createElement: createElement,

        //creates a shived documentFragment
        createDocumentFragment: createDocumentFragment,

        //extends list of elements
        addElements: addElements
      };

      /*--------------------------------------------------------------------------*/

      // expose html5
      window.html5 = html5;

      // shiv the document
      shivDocument(document);

      /*------------------------------- Print Shiv -------------------------------*/

      /** Used to filter media types */
      var reMedia = /^$|\b(?:all|print)\b/;

      /** Used to namespace printable elements */
      var shivNamespace = 'html5shiv';

      /** Detect whether the browser supports shivable style sheets */
      var supportsShivableSheets = !supportsUnknownElements && (function() {
        // assign a false negative if unable to shiv
        var docEl = document.documentElement;
        return !(
          typeof document.namespaces == 'undefined' ||
            typeof document.parentWindow == 'undefined' ||
            typeof docEl.applyElement == 'undefined' ||
            typeof docEl.removeNode == 'undefined' ||
            typeof window.attachEvent == 'undefined'
        );
      }());

      /*--------------------------------------------------------------------------*/

      /**
       * Wraps all HTML5 elements in the given document with printable elements.
       * (eg. the "header" element is wrapped with the "html5shiv:header" element)
       * @private
       * @param {Document} ownerDocument The document.
       * @returns {Array} An array wrappers added.
       */
      function addWrappers(ownerDocument) {
        var node,
        nodes = ownerDocument.getElementsByTagName('*'),
          index = nodes.length,
          reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i'),
          result = [];

        while (index--) {
          node = nodes[index];
          if (reElements.test(node.nodeName)) {
            result.push(node.applyElement(createWrapper(node)));
          }
        }
        return result;
      }

      /**
       * Creates a printable wrapper for the given element.
       * @private
       * @param {Element} element The element.
       * @returns {Element} The wrapper.
       */
      function createWrapper(element) {
        var node,
        nodes = element.attributes,
          index = nodes.length,
          wrapper = element.ownerDocument.createElement(shivNamespace + ':' + element.nodeName);

        // copy element attributes to the wrapper
        while (index--) {
          node = nodes[index];
          node.specified && wrapper.setAttribute(node.nodeName, node.nodeValue);
        }
        // copy element styles to the wrapper
        wrapper.style.cssText = element.style.cssText;
        return wrapper;
      }

      /**
       * Shivs the given CSS text.
       * (eg. header{} becomes html5shiv\:header{})
       * @private
       * @param {String} cssText The CSS text to shiv.
       * @returns {String} The shived CSS text.
       */
      function shivCssText(cssText) {
        var pair,
        parts = cssText.split('{'),
          index = parts.length,
          reElements = RegExp('(^|[\\s,>+~])(' + getElements().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
          replacement = '$1' + shivNamespace + '\\:$2';

        while (index--) {
          pair = parts[index] = parts[index].split('}');
          pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
          parts[index] = pair.join('}');
        }
        return parts.join('{');
      }

      /**
       * Removes the given wrappers, leaving the original elements.
       * @private
       * @params {Array} wrappers An array of printable wrappers.
       */
      function removeWrappers(wrappers) {
        var index = wrappers.length;
        while (index--) {
          wrappers[index].removeNode();
        }
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Shivs the given document for print.
       * @memberOf html5
       * @param {Document} ownerDocument The document to shiv.
       * @returns {Document} The shived document.
       */
      function shivPrint(ownerDocument) {
        var shivedSheet,
        wrappers,
        data = getExpandoData(ownerDocument),
          namespaces = ownerDocument.namespaces,
          ownerWindow = ownerDocument.parentWindow;

        if (!supportsShivableSheets || ownerDocument.printShived) {
          return ownerDocument;
        }
        if (typeof namespaces[shivNamespace] == 'undefined') {
          namespaces.add(shivNamespace);
        }

        function removeSheet() {
          clearTimeout(data._removeSheetTimer);
          if (shivedSheet) {
            shivedSheet.removeNode(true);
          }
          shivedSheet= null;
        }

        ownerWindow.attachEvent('onbeforeprint', function() {

          removeSheet();

          var imports,
          length,
          sheet,
          collection = ownerDocument.styleSheets,
            cssText = [],
            index = collection.length,
            sheets = Array(index);

          // convert styleSheets collection to an array
          while (index--) {
            sheets[index] = collection[index];
          }
          // concat all style sheet CSS text
          while ((sheet = sheets.pop())) {
            // IE does not enforce a same origin policy for external style sheets...
            // but has trouble with some dynamically created stylesheets
            if (!sheet.disabled && reMedia.test(sheet.media)) {

              try {
                imports = sheet.imports;
                length = imports.length;
              } catch(er){
                length = 0;
              }

              for (index = 0; index < length; index++) {
                sheets.push(imports[index]);
              }

              try {
                cssText.push(sheet.cssText);
              } catch(er){}
            }
          }

          // wrap all HTML5 elements with printable elements and add the shived style sheet
          cssText = shivCssText(cssText.reverse().join(''));
          wrappers = addWrappers(ownerDocument);
          shivedSheet = addStyleSheet(ownerDocument, cssText);

        });

        ownerWindow.attachEvent('onafterprint', function() {
          // remove wrappers, leaving the original elements, and remove the shived style sheet
          removeWrappers(wrappers);
          clearTimeout(data._removeSheetTimer);
          data._removeSheetTimer = setTimeout(removeSheet, 500);
        });

        ownerDocument.printShived = true;
        return ownerDocument;
      }

      /*--------------------------------------------------------------------------*/

      // expose API
      html5.type += ' print';
      html5.shivPrint = shivPrint;

      // shiv for print
      shivPrint(document);

      if(typeof module == 'object' && module.exports){
        module.exports = html5;
      }

    }(typeof window !== "undefined" ? window : this, document));
  }

  ;


  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  }
  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    var elems = ['modernizr', 'tspan'];
    while (!mStyle.style) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * testProp() investigates whether a given style property is recognized
   * Property names can be provided in either camelCase or kebab-case.
   *
   * @memberof Modernizr
   * @name Modernizr.testProp
   * @access public
   * @optionName Modernizr.testProp()
   * @optionProp testProp
   * @function testProp
   * @param {string} prop - Name of the CSS property to check
   * @param {string} [value] - Name of the CSS value to check
   * @param {boolean} [useValue] - Whether or not to check the value if @supports isn't supported
   * @returns {boolean}
   * @example
   *
   * Just like [testAllProps](#modernizr-testallprops), only it does not check any vendor prefixed
   * version of the string.
   *
   * Note that the property name must be provided in camelCase (e.g. boxSizing not box-sizing)
   *
   * ```js
   * Modernizr.testProp('pointerEvents')  // true
   * ```
   *
   * You can also provide a value as an optional second argument to check if a
   * specific value is supported
   *
   * ```js
   * Modernizr.testProp('pointerEvents', 'none') // true
   * Modernizr.testProp('pointerEvents', 'penguin') // false
   * ```
   */

  var testProp = ModernizrProto.testProp = function(prop, value, useValue) {
    return testProps([prop], undefined, value, useValue);
  };
  

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;
/*!
{
  "name": "Cookies",
  "property": "cookies",
  "tags": ["storage"],
  "authors": ["tauren"]
}
!*/
/* DOC
Detects whether cookie support is enabled.
*/

  // https://github.com/Modernizr/Modernizr/issues/191

  Modernizr.addTest('cookies', function() {
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking
    // configurations. For example, when blocking cookies via the Advanced
    // Privacy Settings in IE9, it always returns true. And there have been
    // issues in the past with site-specific exceptions.
    // Don't rely on it.

    // try..catch because some in situations `document.cookie` is exposed but throws a
    // SecurityError if you try to access it; e.g. documents created from data URIs
    // or in sandboxed iframes (depending on flags/context)
    try {
      // Create cookie
      document.cookie = 'cookietest=1';
      var ret = document.cookie.indexOf('cookietest=') != -1;
      // Delete cookie
      document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return ret;
    }
    catch (e) {
      return false;
    }
  });

/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
/* DOC
Detects support for SVG in `<embed>` or `<object>` elements.
*/

  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

/*!
{
  "name": "SVG as an <img> tag source",
  "property": "svgasimg",
  "caniuse" : "svg-img",
  "tags": ["svg"],
  "authors": ["Chris Coyier"],
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element"
  }]
}
!*/


  // Original Async test by Stu Cox
  // https://gist.github.com/chriscoyier/8774501

  // Now a Sync test based on good results here
  // http://codepen.io/chriscoyier/pen/bADFx

  // Note http://www.w3.org/TR/SVG11/feature#Image is *supposed* to represent
  // support for the `<image>` tag in SVG, not an SVG file linked from an `<img>`
  // tag in HTML – but it’s a heuristic which works
  Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));


  // Run each test
  testRunner();

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);
/*
 * Copyright (c) 2014 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.1.0 (October 2014)
 *
 * Licensed under the MIT License
 */

 /*global jQuery*/
(function($) {
	'use strict';

	$.fn.succinct = function(options) {

		var settings = $.extend({
				size: 240,
				omission: '...',
				ignore: true
			}, options);

		return this.each(function() {

			var textDefault,
				textTruncated,
				elements = $(this),
				regex    = /[!-\/:-@\[-`{-~]$/,
				init     = function() {
					elements.each(function() {
						textDefault = $(this).html();

						if (textDefault.length > settings.size) {
							textTruncated = $.trim(textDefault)
											.substring(0, settings.size)
											.split(' ')
											.slice(0, -1)
											.join(' ');

							if (settings.ignore) {
								textTruncated = textTruncated.replace(regex, '');
							}

							$(this).html(textTruncated + settings.omission);
						}
					});
				};
			init();
		});
	};
})(jQuery);

/*------------------------------------*\
    #COMMON
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Common methods module
 */
emptyepi.modules.common = (function () {
    var pub = {};


    /**
     * Fade away content
     * @param {jQuery} element
     */
    pub.hideContent = function (element) {
        $(element).animate({
            opacity: "0"
        }, 300, function () {
            $(this).slideUp(300);
        });
    };


    // Expose the public methods
    return pub;
})();

/*------------------------------------*\
    #COOKIES
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Cookie handling module
 */
emptyepi.modules.cookies = (function () {
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

/*------------------------------------*\
    #BROWSER-WIDTH
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Browser width
 */
emptyepi.modules.browserWidth = (function () {
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

/*------------------------------------*\
    #POLYFILLS
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Polyfills module
 */
emptyepi.modules.polyfills = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();

/*------------------------------------*\
    #COLLAPSE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Collapse module
 */
emptyepi.modules.collapse = (function () {
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

/*------------------------------------*\
    #OWL-CAROUSEL
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Owl carousel module
 */
emptyepi.modules.owlCarousel = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
    };


    /**
     * Bind events
     */
    priv.bindEvents = function () {



        // Initialize all carousels
        $(".owl-carousel").owlCarousel({
            items: 1,
            nav: true,
            loop: true,
            navText: [
                "<span aria-hidden='true'>&lt;</span><span class='sr-only'>Föregående bild</span>",
                "<span aria-hidden='true'>&gt;</span><span class='sr-only'>Nästa bild</span>"
            ]
        });

        // Carousel focus
        $(".owl-carousel").on("keyup", function (event) {

            // handle cursor keys
            if (event.keyCode === 37) {
                // go left
                $(this).trigger("prev.owl.carousel");
            } else if (event.keyCode === 39) {
                // go right
                $(this).trigger("next.owl.carousel");
            }

        });

    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();


/*------------------------------------*\
    #PRINT
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.seom = window.seom || {};
seom.modules = seom.modules || {};



/**
 * Print module
 */
seom.modules.print = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
    };


    /**
     * Bind events
     */
    priv.bindEvents = function () {
        $(".js-print").on("click", function (e) {
            e.preventDefault();
            window.print();
        });
    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();

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

/*------------------------------------*\
    #TRUNCATE
\*------------------------------------*/


// References for intellisense
/// <reference path="/Static/scripts/_references.js" />



// Namespace
window.emptyepi = window.emptyepi || {};
emptyepi.modules = emptyepi.modules || {};



/**
 * Truncate text module
 */
emptyepi.modules.truncate = (function () {
    var priv = {};
    var resizeTimer;


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
        priv.truncate();
    };


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

    };


    /**
     * Resize browser
     */
    priv.resize = function () {
        // Re-truncate on window resize. Will only truncate when window is resized smaller.
        priv.truncate();
    };


    /**
     * Truncate
     */
    priv.truncate = function () {

        $(".js-truncate").each(function () {
            var truncate = $(this);
            var textWidth = truncate.width();
            var fontSize = truncate.css("font-size");
            var letterWidth = parseInt(fontSize, 10) / 1.8;
            var rows = truncate.data("rows");
            var truncateSize = Math.floor((textWidth / letterWidth) * rows);
            var truncateContent = truncate.find(".js-truncate-content");

            // Check if truncate element have child element that should be truncated instead
            if (truncateContent.length)
                truncate = truncateContent;

            truncate.succinct({
                size: truncateSize,
                omission: "\u2026"
            });
        });

    };


    // Initialize module
    $(function () {
        priv.init();
    });

})();

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVybml6ci1jdXN0b20uanMiLCJqUXVlcnkuc3VjY2luY3QuanMiLCJjb21tb24uanMiLCJjb29raWVzLmpzIiwic2Vzc2lvbi1zdG9yYWdlLmpzIiwiYnJvd3Nlci13aWR0aC5qcyIsInBvbHlmaWxscy5qcyIsImNvbGxhcHNlLmpzIiwiY29va2llLWFsZXJ0LmpzIiwib3dsLWNhcm91c2VsLmpzIiwicHJpbnQuanMiLCJzaG93LW1vcmUuanMiLCJ0cnVuY2F0ZS5qcyIsInJlc3BvbnNpdmUtYmctaW1hZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4K0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIG1vZGVybml6ciB2My4zLjFcclxuICogQnVpbGQgaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQ/LWNvb2tpZXMtc3ZnLXN2Z2FzaW1nLWFkZHRlc3QtZm5iaW5kLXByaW50c2hpdi10ZXN0cHJvcC1kb250bWluXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYylcclxuICogIEZhcnVrIEF0ZXNcclxuICogIFBhdWwgSXJpc2hcclxuICogIEFsZXggU2V4dG9uXHJcbiAqICBSeWFuIFNlZGRvblxyXG4gKiAgUGF0cmljayBLZXR0bmVyXHJcbiAqICBTdHUgQ294XHJcbiAqICBSaWNoYXJkIEhlcnJlcmFcclxuXHJcbiAqIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuLypcclxuICogTW9kZXJuaXpyIHRlc3RzIHdoaWNoIG5hdGl2ZSBDU1MzIGFuZCBIVE1MNSBmZWF0dXJlcyBhcmUgYXZhaWxhYmxlIGluIHRoZVxyXG4gKiBjdXJyZW50IFVBIGFuZCBtYWtlcyB0aGUgcmVzdWx0cyBhdmFpbGFibGUgdG8geW91IGluIHR3byB3YXlzOiBhcyBwcm9wZXJ0aWVzIG9uXHJcbiAqIGEgZ2xvYmFsIGBNb2Rlcm5penJgIG9iamVjdCwgYW5kIGFzIGNsYXNzZXMgb24gdGhlIGA8aHRtbD5gIGVsZW1lbnQuIFRoaXNcclxuICogaW5mb3JtYXRpb24gYWxsb3dzIHlvdSB0byBwcm9ncmVzc2l2ZWx5IGVuaGFuY2UgeW91ciBwYWdlcyB3aXRoIGEgZ3JhbnVsYXIgbGV2ZWxcclxuICogb2YgY29udHJvbCBvdmVyIHRoZSBleHBlcmllbmNlLlxyXG4qL1xyXG5cclxuOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpe1xyXG4gIHZhciB0ZXN0cyA9IFtdO1xyXG4gIFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIE1vZGVybml6clByb3RvIGlzIHRoZSBjb25zdHJ1Y3RvciBmb3IgTW9kZXJuaXpyXHJcbiAgICpcclxuICAgKiBAY2xhc3NcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqL1xyXG5cclxuICB2YXIgTW9kZXJuaXpyUHJvdG8gPSB7XHJcbiAgICAvLyBUaGUgY3VycmVudCB2ZXJzaW9uLCBkdW1teVxyXG4gICAgX3ZlcnNpb246ICczLjMuMScsXHJcblxyXG4gICAgLy8gQW55IHNldHRpbmdzIHRoYXQgZG9uJ3Qgd29yayBhcyBzZXBhcmF0ZSBtb2R1bGVzXHJcbiAgICAvLyBjYW4gZ28gaW4gaGVyZSBhcyBjb25maWd1cmF0aW9uLlxyXG4gICAgX2NvbmZpZzoge1xyXG4gICAgICAnY2xhc3NQcmVmaXgnOiAnJyxcclxuICAgICAgJ2VuYWJsZUNsYXNzZXMnOiB0cnVlLFxyXG4gICAgICAnZW5hYmxlSlNDbGFzcyc6IHRydWUsXHJcbiAgICAgICd1c2VQcmVmaXhlcyc6IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gUXVldWUgb2YgdGVzdHNcclxuICAgIF9xOiBbXSxcclxuXHJcbiAgICAvLyBTdHViIHRoZXNlIGZvciBwZW9wbGUgd2hvIGFyZSBsaXN0ZW5pbmdcclxuICAgIG9uOiBmdW5jdGlvbih0ZXN0LCBjYikge1xyXG4gICAgICAvLyBJIGRvbid0IHJlYWxseSB0aGluayBwZW9wbGUgc2hvdWxkIGRvIHRoaXMsIGJ1dCB3ZSBjYW5cclxuICAgICAgLy8gc2FmZSBndWFyZCBpdCBhIGJpdC5cclxuICAgICAgLy8gLS0gTk9URTo6IHRoaXMgZ2V0cyBXQVkgb3ZlcnJpZGRlbiBpbiBzcmMvYWRkVGVzdCBmb3IgYWN0dWFsIGFzeW5jIHRlc3RzLlxyXG4gICAgICAvLyBUaGlzIGlzIGluIGNhc2UgcGVvcGxlIGxpc3RlbiB0byBzeW5jaHJvbm91cyB0ZXN0cy4gSSB3b3VsZCBsZWF2ZSBpdCBvdXQsXHJcbiAgICAgIC8vIGJ1dCB0aGUgY29kZSB0byAqZGlzYWxsb3cqIHN5bmMgdGVzdHMgaW4gdGhlIHJlYWwgdmVyc2lvbiBvZiB0aGlzXHJcbiAgICAgIC8vIGZ1bmN0aW9uIGlzIGFjdHVhbGx5IGxhcmdlciB0aGFuIHRoaXMuXHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBjYihzZWxmW3Rlc3RdKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFRlc3Q6IGZ1bmN0aW9uKG5hbWUsIGZuLCBvcHRpb25zKSB7XHJcbiAgICAgIHRlc3RzLnB1c2goe25hbWU6IG5hbWUsIGZuOiBmbiwgb3B0aW9uczogb3B0aW9uc30pO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRBc3luY1Rlc3Q6IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgIHRlc3RzLnB1c2goe25hbWU6IG51bGwsIGZuOiBmbn0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFxyXG5cclxuICAvLyBGYWtlIHNvbWUgb2YgT2JqZWN0LmNyZWF0ZSBzbyB3ZSBjYW4gZm9yY2Ugbm9uIHRlc3QgcmVzdWx0cyB0byBiZSBub24gXCJvd25cIiBwcm9wZXJ0aWVzLlxyXG4gIHZhciBNb2Rlcm5penIgPSBmdW5jdGlvbigpIHt9O1xyXG4gIE1vZGVybml6ci5wcm90b3R5cGUgPSBNb2Rlcm5penJQcm90bztcclxuXHJcbiAgLy8gTGVhayBtb2Rlcm5penIgZ2xvYmFsbHkgd2hlbiB5b3UgYHJlcXVpcmVgIGl0IHJhdGhlciB0aGFuIGZvcmNlIGl0IGhlcmUuXHJcbiAgLy8gT3ZlcndyaXRlIG5hbWUgc28gY29uc3RydWN0b3IgbmFtZSBpcyBuaWNlciA6RFxyXG4gIE1vZGVybml6ciA9IG5ldyBNb2Rlcm5penIoKTtcclxuXHJcbiAgXHJcblxyXG4gIHZhciBjbGFzc2VzID0gW107XHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICAqIGlzIHJldHVybnMgYSBib29sZWFuIGlmIHRoZSB0eXBlb2YgYW4gb2JqIGlzIGV4YWN0bHkgdHlwZS5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBpc1xyXG4gICAqIEBwYXJhbSB7Kn0gb2JqIC0gQSB0aGluZyB3ZSB3YW50IHRvIGNoZWNrIHRoZSB0eXBlIG9mXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBBIHN0cmluZyB0byBjb21wYXJlIHRoZSB0eXBlb2YgYWdhaW5zdFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBpcyhvYmosIHR5cGUpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSB0eXBlO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1biB0aHJvdWdoIGFsbCB0ZXN0cyBhbmQgZGV0ZWN0IHRoZWlyIHN1cHBvcnQgaW4gdGhlIGN1cnJlbnQgVUEuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gdGVzdFJ1bm5lcigpIHtcclxuICAgIHZhciBmZWF0dXJlTmFtZXM7XHJcbiAgICB2YXIgZmVhdHVyZTtcclxuICAgIHZhciBhbGlhc0lkeDtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICB2YXIgbmFtZUlkeDtcclxuICAgIHZhciBmZWF0dXJlTmFtZTtcclxuICAgIHZhciBmZWF0dXJlTmFtZVNwbGl0O1xyXG5cclxuICAgIGZvciAodmFyIGZlYXR1cmVJZHggaW4gdGVzdHMpIHtcclxuICAgICAgaWYgKHRlc3RzLmhhc093blByb3BlcnR5KGZlYXR1cmVJZHgpKSB7XHJcbiAgICAgICAgZmVhdHVyZU5hbWVzID0gW107XHJcbiAgICAgICAgZmVhdHVyZSA9IHRlc3RzW2ZlYXR1cmVJZHhdO1xyXG4gICAgICAgIC8vIHJ1biB0aGUgdGVzdCwgdGhyb3cgdGhlIHJldHVybiB2YWx1ZSBpbnRvIHRoZSBNb2Rlcm5penIsXHJcbiAgICAgICAgLy8gdGhlbiBiYXNlZCBvbiB0aGF0IGJvb2xlYW4sIGRlZmluZSBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWVcclxuICAgICAgICAvLyBhbmQgcHVzaCBpdCBpbnRvIGFuIGFycmF5IG9mIGNsYXNzZXMgd2UnbGwgam9pbiBsYXRlci5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG5hbWUsIGl0J3MgYW4gJ2FzeW5jJyB0ZXN0IHRoYXQgaXMgcnVuLFxyXG4gICAgICAgIC8vIGJ1dCBub3QgZGlyZWN0bHkgYWRkZWQgdG8gdGhlIG9iamVjdC4gVGhhdCBzaG91bGRcclxuICAgICAgICAvLyBiZSBkb25lIHdpdGggYSBwb3N0LXJ1biBhZGRUZXN0IGNhbGwuXHJcbiAgICAgICAgaWYgKGZlYXR1cmUubmFtZSkge1xyXG4gICAgICAgICAgZmVhdHVyZU5hbWVzLnB1c2goZmVhdHVyZS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgIGlmIChmZWF0dXJlLm9wdGlvbnMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCBhbGwgdGhlIGFsaWFzZXMgaW50byB0aGUgbmFtZXMgbGlzdFxyXG4gICAgICAgICAgICBmb3IgKGFsaWFzSWR4ID0gMDsgYWxpYXNJZHggPCBmZWF0dXJlLm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7IGFsaWFzSWR4KyspIHtcclxuICAgICAgICAgICAgICBmZWF0dXJlTmFtZXMucHVzaChmZWF0dXJlLm9wdGlvbnMuYWxpYXNlc1thbGlhc0lkeF0udG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJ1biB0aGUgdGVzdCwgb3IgdXNlIHRoZSByYXcgdmFsdWUgaWYgaXQncyBub3QgYSBmdW5jdGlvblxyXG4gICAgICAgIHJlc3VsdCA9IGlzKGZlYXR1cmUuZm4sICdmdW5jdGlvbicpID8gZmVhdHVyZS5mbigpIDogZmVhdHVyZS5mbjtcclxuXHJcblxyXG4gICAgICAgIC8vIFNldCBlYWNoIG9mIHRoZSBuYW1lcyBvbiB0aGUgTW9kZXJuaXpyIG9iamVjdFxyXG4gICAgICAgIGZvciAobmFtZUlkeCA9IDA7IG5hbWVJZHggPCBmZWF0dXJlTmFtZXMubGVuZ3RoOyBuYW1lSWR4KyspIHtcclxuICAgICAgICAgIGZlYXR1cmVOYW1lID0gZmVhdHVyZU5hbWVzW25hbWVJZHhdO1xyXG4gICAgICAgICAgLy8gU3VwcG9ydCBkb3QgcHJvcGVydGllcyBhcyBzdWIgdGVzdHMuIFdlIGRvbid0IGRvIGNoZWNraW5nIHRvIG1ha2Ugc3VyZVxyXG4gICAgICAgICAgLy8gdGhhdCB0aGUgaW1wbGllZCBwYXJlbnQgdGVzdHMgaGF2ZSBiZWVuIGFkZGVkLiBZb3UgbXVzdCBjYWxsIHRoZW0gaW5cclxuICAgICAgICAgIC8vIG9yZGVyIChlaXRoZXIgaW4gdGhlIHRlc3QsIG9yIG1ha2UgdGhlIHBhcmVudCB0ZXN0IGEgZGVwZW5kZW5jeSkuXHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gQ2FwIGl0IHRvIFRXTyB0byBtYWtlIHRoZSBsb2dpYyBzaW1wbGUgYW5kIGJlY2F1c2Ugd2hvIG5lZWRzIHRoYXQga2luZCBvZiBzdWJ0ZXN0aW5nXHJcbiAgICAgICAgICAvLyBoYXNodGFnIGZhbW91cyBsYXN0IHdvcmRzXHJcbiAgICAgICAgICBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZU5hbWUuc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gcmVzdWx0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY2FzdCB0byBhIEJvb2xlYW4sIGlmIG5vdCBvbmUgYWxyZWFkeVxyXG4gICAgICAgICAgICAvKiBqc2hpbnQgLVcwNTMgKi9cclxuICAgICAgICAgICAgaWYgKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSAmJiAhKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSBpbnN0YW5jZW9mIEJvb2xlYW4pKSB7XHJcbiAgICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gbmV3IEJvb2xlYW4oTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dW2ZlYXR1cmVOYW1lU3BsaXRbMV1dID0gcmVzdWx0O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgocmVzdWx0ID8gJycgOiAnbm8tJykgKyBmZWF0dXJlTmFtZVNwbGl0LmpvaW4oJy0nKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogaGFzT3duUHJvcCBpcyBhIHNoaW0gZm9yIGhhc093blByb3BlcnR5IHRoYXQgaXMgbmVlZGVkIGZvciBTYWZhcmkgMi4wIHN1cHBvcnRcclxuICAgKlxyXG4gICAqIEBhdXRob3Iga2FuZ2F4XHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGhhc093blByb3BcclxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjaGVjayBmb3IgYSBwcm9wZXJ0eVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIFRoZSBwcm9wZXJ0eSB0byBjaGVjayBmb3JcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgLy8gaGFzT3duUHJvcGVydHkgc2hpbSBieSBrYW5nYXggbmVlZGVkIGZvciBTYWZhcmkgMi4wIHN1cHBvcnRcclxuICB2YXIgaGFzT3duUHJvcDtcclxuXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIF9oYXNPd25Qcm9wZXJ0eSA9ICh7fSkuaGFzT3duUHJvcGVydHk7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgLyogd2UgaGF2ZSBubyB3YXkgb2YgdGVzdGluZyBJRSA1LjUgb3Igc2FmYXJpIDIsXHJcbiAgICAgKiBzbyBqdXN0IGFzc3VtZSB0aGUgZWxzZSBnZXRzIGhpdCAqL1xyXG4gICAgaWYgKCFpcyhfaGFzT3duUHJvcGVydHksICd1bmRlZmluZWQnKSAmJiAhaXMoX2hhc093blByb3BlcnR5LmNhbGwsICd1bmRlZmluZWQnKSkge1xyXG4gICAgICBoYXNPd25Qcm9wID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBoYXNPd25Qcm9wID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyAvKiB5ZXMsIHRoaXMgY2FuIGdpdmUgZmFsc2UgcG9zaXRpdmVzL25lZ2F0aXZlcywgYnV0IG1vc3Qgb2YgdGhlIHRpbWUgd2UgZG9uJ3QgY2FyZSBhYm91dCB0aG9zZSAqL1xyXG4gICAgICAgIHJldHVybiAoKHByb3BlcnR5IGluIG9iamVjdCkgJiYgaXMob2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZVtwcm9wZXJ0eV0sICd1bmRlZmluZWQnKSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICAqIGRvY0VsZW1lbnQgaXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIHRvIGdyYWIgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgZG9jdW1lbnRcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBUaGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxyXG4gICAqL1xyXG5cclxuICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICBcclxuXHJcbiAgLyoqXHJcbiAgICogQSBjb252ZW5pZW5jZSBoZWxwZXIgdG8gY2hlY2sgaWYgdGhlIGRvY3VtZW50IHdlIGFyZSBydW5uaW5nIGluIGlzIGFuIFNWRyBkb2N1bWVudFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcblxyXG4gIHZhciBpc1NWRyA9IGRvY0VsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2Zyc7XHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICAqIHNldENsYXNzZXMgdGFrZXMgYW4gYXJyYXkgb2YgY2xhc3MgbmFtZXMgYW5kIGFkZHMgdGhlbSB0byB0aGUgcm9vdCBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gc2V0Q2xhc3Nlc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGNsYXNzZXMgLSBBcnJheSBvZiBjbGFzcyBuYW1lc1xyXG4gICAqL1xyXG5cclxuICAvLyBQYXNzIGluIGFuIGFuZCBhcnJheSBvZiBjbGFzcyBuYW1lcywgZS5nLjpcclxuICAvLyAgWyduby13ZWJwJywgJ2JvcmRlcnJhZGl1cycsIC4uLl1cclxuICBmdW5jdGlvbiBzZXRDbGFzc2VzKGNsYXNzZXMpIHtcclxuICAgIHZhciBjbGFzc05hbWUgPSBkb2NFbGVtZW50LmNsYXNzTmFtZTtcclxuICAgIHZhciBjbGFzc1ByZWZpeCA9IE1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4IHx8ICcnO1xyXG5cclxuICAgIGlmIChpc1NWRykge1xyXG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUuYmFzZVZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2UgYG5vLWpzYCB0byBganNgIChpbmRlcGVuZGVudGx5IG9mIHRoZSBgZW5hYmxlQ2xhc3Nlc2Agb3B0aW9uKVxyXG4gICAgLy8gSGFuZGxlIGNsYXNzUHJlZml4IG9uIHRoaXMgdG9vXHJcbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzcykge1xyXG4gICAgICB2YXIgcmVKUyA9IG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc1ByZWZpeCArICduby1qcyhcXFxcc3wkKScpO1xyXG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUucmVwbGFjZShyZUpTLCAnJDEnICsgY2xhc3NQcmVmaXggKyAnanMkMicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVDbGFzc2VzKSB7XHJcbiAgICAgIC8vIEFkZCB0aGUgbmV3IGNsYXNzZXNcclxuICAgICAgY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzUHJlZml4ICsgY2xhc3Nlcy5qb2luKCcgJyArIGNsYXNzUHJlZml4KTtcclxuICAgICAgaXNTVkcgPyBkb2NFbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsID0gY2xhc3NOYW1lIDogZG9jRWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuXHJcbiAgIC8vIF9sIHRyYWNrcyBsaXN0ZW5lcnMgZm9yIGFzeW5jIHRlc3RzLCBhcyB3ZWxsIGFzIHRlc3RzIHRoYXQgZXhlY3V0ZSBhZnRlciB0aGUgaW5pdGlhbCBydW5cclxuICBNb2Rlcm5penJQcm90by5fbCA9IHt9O1xyXG5cclxuICAvKipcclxuICAgKiBNb2Rlcm5penIub24gaXMgYSB3YXkgdG8gbGlzdGVuIGZvciB0aGUgY29tcGxldGlvbiBvZiBhc3luYyB0ZXN0cy4gQmVpbmdcclxuICAgKiBhc3luY2hyb25vdXMsIHRoZXkgbWF5IG5vdCBmaW5pc2ggYmVmb3JlIHlvdXIgc2NyaXB0cyBydW4uIEFzIGEgcmVzdWx0IHlvdVxyXG4gICAqIHdpbGwgZ2V0IGEgcG9zc2libHkgZmFsc2UgbmVnYXRpdmUgYHVuZGVmaW5lZGAgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLm9uXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAZnVuY3Rpb24gb25cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmVhdHVyZSAtIFN0cmluZyBuYW1lIG9mIHRoZSBmZWF0dXJlIGRldGVjdFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gcmV0dXJuaW5nIGEgQm9vbGVhbiAtIHRydWUgaWYgZmVhdHVyZSBpcyBzdXBwb3J0ZWQsIGZhbHNlIGlmIG5vdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci5vbignZmxhc2gnLCBmdW5jdGlvbiggcmVzdWx0ICkge1xyXG4gICAqICAgaWYgKHJlc3VsdCkge1xyXG4gICAqICAgIC8vIHRoZSBicm93c2VyIGhhcyBmbGFzaFxyXG4gICAqICAgfSBlbHNlIHtcclxuICAgKiAgICAgLy8gdGhlIGJyb3dzZXIgZG9lcyBub3QgaGF2ZSBmbGFzaFxyXG4gICAqICAgfVxyXG4gICAqIH0pO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG5cclxuICBNb2Rlcm5penJQcm90by5vbiA9IGZ1bmN0aW9uKGZlYXR1cmUsIGNiKSB7XHJcbiAgICAvLyBDcmVhdGUgdGhlIGxpc3Qgb2YgbGlzdGVuZXJzIGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuICAgIGlmICghdGhpcy5fbFtmZWF0dXJlXSkge1xyXG4gICAgICB0aGlzLl9sW2ZlYXR1cmVdID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHVzaCB0aGlzIHRlc3Qgb24gdG8gdGhlIGxpc3RlbmVyIGxpc3RcclxuICAgIHRoaXMuX2xbZmVhdHVyZV0ucHVzaChjYik7XHJcblxyXG4gICAgLy8gSWYgaXQncyBhbHJlYWR5IGJlZW4gcmVzb2x2ZWQsIHRyaWdnZXIgaXQgb24gbmV4dCB0aWNrXHJcbiAgICBpZiAoTW9kZXJuaXpyLmhhc093blByb3BlcnR5KGZlYXR1cmUpKSB7XHJcbiAgICAgIC8vIE5leHQgVGlja1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVybml6ci5fdHJpZ2dlcihmZWF0dXJlLCBNb2Rlcm5penJbZmVhdHVyZV0pO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBfdHJpZ2dlciBpcyB0aGUgcHJpdmF0ZSBmdW5jdGlvbiB1c2VkIHRvIHNpZ25hbCB0ZXN0IGNvbXBsZXRpb24gYW5kIHJ1biBhbnlcclxuICAgKiBjYWxsYmFja3MgcmVnaXN0ZXJlZCB0aHJvdWdoIFtNb2Rlcm5penIub25dKCNtb2Rlcm5penItb24pXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLl90cmlnZ2VyXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIF90cmlnZ2VyXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmUgLSBzdHJpbmcgbmFtZSBvZiB0aGUgZmVhdHVyZSBkZXRlY3RcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufGJvb2xlYW59IFtyZXNdIC0gQSBmZWF0dXJlIGRldGVjdGlvbiBmdW5jdGlvbiwgb3IgdGhlIGJvb2xlYW4gPVxyXG4gICAqIHJlc3VsdCBvZiBhIGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uXHJcbiAgICovXHJcblxyXG4gIE1vZGVybml6clByb3RvLl90cmlnZ2VyID0gZnVuY3Rpb24oZmVhdHVyZSwgcmVzKSB7XHJcbiAgICBpZiAoIXRoaXMuX2xbZmVhdHVyZV0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYnMgPSB0aGlzLl9sW2ZlYXR1cmVdO1xyXG5cclxuICAgIC8vIEZvcmNlIGFzeW5jXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgaSwgY2I7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjYiA9IGNic1tpXTtcclxuICAgICAgICBjYihyZXMpO1xyXG4gICAgICB9XHJcbiAgICB9LCAwKTtcclxuXHJcbiAgICAvLyBEb24ndCB0cmlnZ2VyIHRoZXNlIGFnYWluXHJcbiAgICBkZWxldGUgdGhpcy5fbFtmZWF0dXJlXTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBhZGRUZXN0IGFsbG93cyB5b3UgdG8gZGVmaW5lIHlvdXIgb3duIGZlYXR1cmUgZGV0ZWN0cyB0aGF0IGFyZSBub3QgY3VycmVudGx5XHJcbiAgICogaW5jbHVkZWQgaW4gTW9kZXJuaXpyICh1bmRlciB0aGUgY292ZXJzIGl0J3MgdGhlIGV4YWN0IHNhbWUgY29kZSBNb2Rlcm5penJcclxuICAgKiB1c2VzIGZvciBpdHMgb3duIFtmZWF0dXJlIGRldGVjdGlvbnNdKGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL3RyZWUvbWFzdGVyL2ZlYXR1cmUtZGV0ZWN0cykpLiBKdXN0IGxpa2UgdGhlIG9mZmljYWwgZGV0ZWN0cywgdGhlIHJlc3VsdFxyXG4gICAqIHdpbGwgYmUgYWRkZWQgb250byB0aGUgTW9kZXJuaXpyIG9iamVjdCwgYXMgd2VsbCBhcyBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWUgc2V0IG9uXHJcbiAgICogdGhlIGh0bWwgZWxlbWVudCB3aGVuIGNvbmZpZ3VyZWQgdG8gZG8gc29cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcclxuICAgKiBAbmFtZSBNb2Rlcm5penIuYWRkVGVzdFxyXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci5hZGRUZXN0KClcclxuICAgKiBAb3B0aW9uUHJvcCBhZGRUZXN0XHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAZnVuY3Rpb24gYWRkVGVzdFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gZmVhdHVyZSAtIFRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgZmVhdHVyZSBkZXRlY3QsIG9yIGFuXHJcbiAgICogb2JqZWN0IG9mIGZlYXR1cmUgZGV0ZWN0IG5hbWVzIGFuZCB0ZXN0XHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFufSB0ZXN0IC0gRnVuY3Rpb24gcmV0dXJuaW5nIHRydWUgaWYgZmVhdHVyZSBpcyBzdXBwb3J0ZWQsXHJcbiAgICogZmFsc2UgaWYgbm90LiBPdGhlcndpc2UgYSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0cyBvZiBhIGZlYXR1cmUgZGV0ZWN0aW9uXHJcbiAgICogQGV4YW1wbGVcclxuICAgKlxyXG4gICAqIFRoZSBtb3N0IGNvbW1vbiB3YXkgb2YgY3JlYXRpbmcgeW91ciBvd24gZmVhdHVyZSBkZXRlY3RzIGlzIGJ5IGNhbGxpbmdcclxuICAgKiBgTW9kZXJuaXpyLmFkZFRlc3RgIHdpdGggYSBzdHJpbmcgKHByZWZlcmFibHkganVzdCBsb3dlcmNhc2UsIHdpdGhvdXQgYW55XHJcbiAgICogcHVuY3R1YXRpb24pLCBhbmQgYSBmdW5jdGlvbiB5b3Ugd2FudCBleGVjdXRlZCB0aGF0IHdpbGwgcmV0dXJuIGEgYm9vbGVhbiByZXN1bHRcclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLmFkZFRlc3QoJ2l0c1R1ZXNkYXknLCBmdW5jdGlvbigpIHtcclxuICAgKiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAqICByZXR1cm4gZC5nZXREYXkoKSA9PT0gMjtcclxuICAgKiB9KTtcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIFdoZW4gdGhlIGFib3ZlIGlzIHJ1biwgaXQgd2lsbCBzZXQgTW9kZXJuaXpyLml0c3R1ZXNkYXkgdG8gYHRydWVgIHdoZW4gaXQgaXMgdHVlc2RheSxcclxuICAgKiBhbmQgdG8gYGZhbHNlYCBldmVyeSBvdGhlciBkYXkgb2YgdGhlIHdlZWsuIE9uZSB0aGluZyB0byBub3RpY2UgaXMgdGhhdCB0aGUgbmFtZXMgb2ZcclxuICAgKiBmZWF0dXJlIGRldGVjdCBmdW5jdGlvbnMgYXJlIGFsd2F5cyBsb3dlcmNhc2VkIHdoZW4gYWRkZWQgdG8gdGhlIE1vZGVybml6ciBvYmplY3QuIFRoYXRcclxuICAgKiBtZWFucyB0aGF0IGBNb2Rlcm5penIuaXRzVHVlc2RheWAgd2lsbCBub3QgZXhpc3QsIGJ1dCBgTW9kZXJuaXpyLml0c3R1ZXNkYXlgIHdpbGwuXHJcbiAgICpcclxuICAgKlxyXG4gICAqICBTaW5jZSB3ZSBvbmx5IGxvb2sgYXQgdGhlIHJldHVybmVkIHZhbHVlIGZyb20gYW55IGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uLFxyXG4gICAqICB5b3UgZG8gbm90IG5lZWQgdG8gYWN0dWFsbHkgdXNlIGEgZnVuY3Rpb24uIEZvciBzaW1wbGUgZGV0ZWN0aW9ucywganVzdCBwYXNzaW5nXHJcbiAgICogIGluIGEgc3RhdGVtZW50IHRoYXQgd2lsbCByZXR1cm4gYSBib29sZWFuIHZhbHVlIHdvcmtzIGp1c3QgZmluZS5cclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLmFkZFRlc3QoJ2hhc0pxdWVyeScsICdqUXVlcnknIGluIHdpbmRvdyk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBKdXN0IGxpa2UgYmVmb3JlLCB3aGVuIHRoZSBhYm92ZSBydW5zIGBNb2Rlcm5penIuaGFzanF1ZXJ5YCB3aWxsIGJlIHRydWUgaWZcclxuICAgKiBqUXVlcnkgaGFzIGJlZW4gaW5jbHVkZWQgb24gdGhlIHBhZ2UuIE5vdCB1c2luZyBhIGZ1bmN0aW9uIHNhdmVzIGEgc21hbGwgYW1vdW50XHJcbiAgICogb2Ygb3ZlcmhlYWQgZm9yIHRoZSBicm93c2VyLCBhcyB3ZWxsIGFzIG1ha2luZyB5b3VyIGNvZGUgbXVjaCBtb3JlIHJlYWRhYmxlLlxyXG4gICAqXHJcbiAgICogRmluYWxseSwgeW91IGFsc28gaGF2ZSB0aGUgYWJpbGl0eSB0byBwYXNzIGluIGFuIG9iamVjdCBvZiBmZWF0dXJlIG5hbWVzIGFuZFxyXG4gICAqIHRoZWlyIHRlc3RzLiBUaGlzIGlzIGhhbmR5IGlmIHlvdSB3YW50IHRvIGFkZCBtdWx0aXBsZSBkZXRlY3Rpb25zIGluIG9uZSBnby5cclxuICAgKiBUaGUga2V5cyBzaG91bGQgYWx3YXlzIGJlIGEgc3RyaW5nLCBhbmQgdGhlIHZhbHVlIGNhbiBiZSBlaXRoZXIgYSBib29sZWFuIG9yXHJcbiAgICogZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYm9vbGVhbi5cclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogdmFyIGRldGVjdHMgPSB7XHJcbiAgICogICdoYXNqcXVlcnknOiAnalF1ZXJ5JyBpbiB3aW5kb3csXHJcbiAgICogICdpdHN0dWVzZGF5JzogZnVuY3Rpb24oKSB7XHJcbiAgICogICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAqICAgIHJldHVybiBkLmdldERheSgpID09PSAyO1xyXG4gICAqICB9XHJcbiAgICogfVxyXG4gICAqXHJcbiAgICogTW9kZXJuaXpyLmFkZFRlc3QoZGV0ZWN0cyk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBUaGVyZSBpcyByZWFsbHkgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBmaXJzdCBtZXRob2RzIGFuZCB0aGlzIG9uZSwgaXQgaXNcclxuICAgKiBqdXN0IGEgY29udmVuaWVuY2UgdG8gbGV0IHlvdSB3cml0ZSBtb3JlIHJlYWRhYmxlIGNvZGUuXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZFRlc3QoZmVhdHVyZSwgdGVzdCkge1xyXG5cclxuICAgIGlmICh0eXBlb2YgZmVhdHVyZSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gZmVhdHVyZSkge1xyXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGZlYXR1cmUsIGtleSkpIHtcclxuICAgICAgICAgIGFkZFRlc3Qoa2V5LCBmZWF0dXJlWyBrZXkgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgZmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgdmFyIGZlYXR1cmVOYW1lU3BsaXQgPSBmZWF0dXJlLnNwbGl0KCcuJyk7XHJcbiAgICAgIHZhciBsYXN0ID0gTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dO1xyXG5cclxuICAgICAgLy8gQWdhaW4sIHdlIGRvbid0IGNoZWNrIGZvciBwYXJlbnQgdGVzdCBleGlzdGVuY2UuIEdldCB0aGF0IHJpZ2h0LCB0aG91Z2guXHJcbiAgICAgIGlmIChmZWF0dXJlTmFtZVNwbGl0Lmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgbGFzdCA9IGxhc3RbZmVhdHVyZU5hbWVTcGxpdFsxXV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgbGFzdCAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHdlJ3JlIGdvaW5nIHRvIHF1aXQgaWYgeW91J3JlIHRyeWluZyB0byBvdmVyd3JpdGUgYW4gZXhpc3RpbmcgdGVzdFxyXG4gICAgICAgIC8vIGlmIHdlIHdlcmUgdG8gYWxsb3cgaXQsIHdlJ2QgZG8gdGhpczpcclxuICAgICAgICAvLyAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJcXFxcYihuby0pP1wiICsgZmVhdHVyZSArIFwiXFxcXGJcIik7XHJcbiAgICAgICAgLy8gICBkb2NFbGVtZW50LmNsYXNzTmFtZSA9IGRvY0VsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoIHJlLCAnJyApO1xyXG4gICAgICAgIC8vIGJ1dCwgbm8gcmx5LCBzdHVmZiAnZW0uXHJcbiAgICAgICAgcmV0dXJuIE1vZGVybml6cjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGVzdCA9IHR5cGVvZiB0ZXN0ID09ICdmdW5jdGlvbicgPyB0ZXN0KCkgOiB0ZXN0O1xyXG5cclxuICAgICAgLy8gU2V0IHRoZSB2YWx1ZSAodGhpcyBpcyB0aGUgbWFnaWMsIHJpZ2h0IGhlcmUpLlxyXG4gICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IHRlc3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY2FzdCB0byBhIEJvb2xlYW4sIGlmIG5vdCBvbmUgYWxyZWFkeVxyXG4gICAgICAgIC8qIGpzaGludCAtVzA1MyAqL1xyXG4gICAgICAgIGlmIChNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gJiYgIShNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gaW5zdGFuY2VvZiBCb29sZWFuKSkge1xyXG4gICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gbmV3IEJvb2xlYW4oTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXVtmZWF0dXJlTmFtZVNwbGl0WzFdXSA9IHRlc3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNldCBhIHNpbmdsZSBjbGFzcyAoZWl0aGVyIGBmZWF0dXJlYCBvciBgbm8tZmVhdHVyZWApXHJcbiAgICAgIC8qIGpzaGludCAtVzA0MSAqL1xyXG4gICAgICBzZXRDbGFzc2VzKFsoISF0ZXN0ICYmIHRlc3QgIT0gZmFsc2UgPyAnJyA6ICduby0nKSArIGZlYXR1cmVOYW1lU3BsaXQuam9pbignLScpXSk7XHJcbiAgICAgIC8qIGpzaGludCArVzA0MSAqL1xyXG5cclxuICAgICAgLy8gVHJpZ2dlciB0aGUgZXZlbnRcclxuICAgICAgTW9kZXJuaXpyLl90cmlnZ2VyKGZlYXR1cmUsIHRlc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBNb2Rlcm5penI7IC8vIGFsbG93IGNoYWluaW5nLlxyXG4gIH1cclxuXHJcbiAgLy8gQWZ0ZXIgYWxsIHRoZSB0ZXN0cyBhcmUgcnVuLCBhZGQgc2VsZiB0byB0aGUgTW9kZXJuaXpyIHByb3RvdHlwZVxyXG4gIE1vZGVybml6ci5fcS5wdXNoKGZ1bmN0aW9uKCkge1xyXG4gICAgTW9kZXJuaXpyUHJvdG8uYWRkVGVzdCA9IGFkZFRlc3Q7XHJcbiAgfSk7XHJcblxyXG4gIFxyXG5cclxuXHJcbi8qKlxyXG4gICogQG9wdGlvbk5hbWUgaHRtbDVwcmludHNoaXZcclxuICAqIEBvcHRpb25Qcm9wIGh0bWw1cHJpbnRzaGl2XHJcbiAgKi9cclxuXHJcbiAgLy8gVGFrZSB0aGUgaHRtbDUgdmFyaWFibGUgb3V0IG9mIHRoZSBodG1sNXNoaXYgc2NvcGUgc28gd2UgY2FuIHJldHVybiBpdC5cclxuICB2YXIgaHRtbDU7XHJcbiAgaWYgKCFpc1NWRykge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByZXNlcnZlIEhUTUw1IFNoaXYgMy43LjMgfCBAYWZhcmthcyBAamRhbHRvbiBAam9uX25lYWwgQHJlbSB8IE1JVC9HUEwyIExpY2Vuc2VkXHJcbiAgICAgKi9cclxuICAgIDsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xyXG4gICAgICAvKmpzaGludCBldmlsOnRydWUgKi9cclxuICAgICAgLyoqIHZlcnNpb24gKi9cclxuICAgICAgdmFyIHZlcnNpb24gPSAnMy43LjMnO1xyXG5cclxuICAgICAgLyoqIFByZXNldCBvcHRpb25zICovXHJcbiAgICAgIHZhciBvcHRpb25zID0gd2luZG93Lmh0bWw1IHx8IHt9O1xyXG5cclxuICAgICAgLyoqIFVzZWQgdG8gc2tpcCBwcm9ibGVtIGVsZW1lbnRzICovXHJcbiAgICAgIHZhciByZVNraXAgPSAvXjx8Xig/OmJ1dHRvbnxtYXB8c2VsZWN0fHRleHRhcmVhfG9iamVjdHxpZnJhbWV8b3B0aW9ufG9wdGdyb3VwKSQvaTtcclxuXHJcbiAgICAgIC8qKiBOb3QgYWxsIGVsZW1lbnRzIGNhbiBiZSBjbG9uZWQgaW4gSUUgKiovXHJcbiAgICAgIHZhciBzYXZlQ2xvbmVzID0gL14oPzphfGJ8Y29kZXxkaXZ8ZmllbGRzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aXxsYWJlbHxsaXxvbHxwfHF8c3BhbnxzdHJvbmd8c3R5bGV8dGFibGV8dGJvZHl8dGR8dGh8dHJ8dWwpJC9pO1xyXG5cclxuICAgICAgLyoqIERldGVjdCB3aGV0aGVyIHRoZSBicm93c2VyIHN1cHBvcnRzIGRlZmF1bHQgaHRtbDUgc3R5bGVzICovXHJcbiAgICAgIHZhciBzdXBwb3J0c0h0bWw1U3R5bGVzO1xyXG5cclxuICAgICAgLyoqIE5hbWUgb2YgdGhlIGV4cGFuZG8sIHRvIHdvcmsgd2l0aCBtdWx0aXBsZSBkb2N1bWVudHMgb3IgdG8gcmUtc2hpdiBvbmUgZG9jdW1lbnQgKi9cclxuICAgICAgdmFyIGV4cGFuZG8gPSAnX2h0bWw1c2hpdic7XHJcblxyXG4gICAgICAvKiogVGhlIGlkIGZvciB0aGUgdGhlIGRvY3VtZW50cyBleHBhbmRvICovXHJcbiAgICAgIHZhciBleHBhbklEID0gMDtcclxuXHJcbiAgICAgIC8qKiBDYWNoZWQgZGF0YSBmb3IgZWFjaCBkb2N1bWVudCAqL1xyXG4gICAgICB2YXIgZXhwYW5kb0RhdGEgPSB7fTtcclxuXHJcbiAgICAgIC8qKiBEZXRlY3Qgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyB1bmtub3duIGVsZW1lbnRzICovXHJcbiAgICAgIHZhciBzdXBwb3J0c1Vua25vd25FbGVtZW50cztcclxuXHJcbiAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICBhLmlubmVySFRNTCA9ICc8eHl6PjwveHl6Pic7XHJcbiAgICAgICAgICAvL2lmIHRoZSBoaWRkZW4gcHJvcGVydHkgaXMgaW1wbGVtZW50ZWQgd2UgY2FuIGFzc3VtZSwgdGhhdCB0aGUgYnJvd3NlciBzdXBwb3J0cyBiYXNpYyBIVE1MNSBTdHlsZXNcclxuICAgICAgICAgIHN1cHBvcnRzSHRtbDVTdHlsZXMgPSAoJ2hpZGRlbicgaW4gYSk7XHJcblxyXG4gICAgICAgICAgc3VwcG9ydHNVbmtub3duRWxlbWVudHMgPSBhLmNoaWxkTm9kZXMubGVuZ3RoID09IDEgfHwgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBhc3NpZ24gYSBmYWxzZSBwb3NpdGl2ZSBpZiB1bmFibGUgdG8gc2hpdlxyXG4gICAgICAgICAgICAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCkoJ2EnKTtcclxuICAgICAgICAgICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgdHlwZW9mIGZyYWcuY2xvbmVOb2RlID09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgZnJhZy5jcmVhdGVEb2N1bWVudEZyYWdtZW50ID09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgZnJhZy5jcmVhdGVFbGVtZW50ID09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KCkpO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgLy8gYXNzaWduIGEgZmFsc2UgcG9zaXRpdmUgaWYgZGV0ZWN0aW9uIGZhaWxzID0+IHVuYWJsZSB0byBzaGl2XHJcbiAgICAgICAgICBzdXBwb3J0c0h0bWw1U3R5bGVzID0gdHJ1ZTtcclxuICAgICAgICAgIHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KCkpO1xyXG5cclxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQ3JlYXRlcyBhIHN0eWxlIHNoZWV0IHdpdGggdGhlIGdpdmVuIENTUyB0ZXh0IGFuZCBhZGRzIGl0IHRvIHRoZSBkb2N1bWVudC5cclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NUZXh0IFRoZSBDU1MgdGV4dC5cclxuICAgICAgICogQHJldHVybnMge1N0eWxlU2hlZXR9IFRoZSBzdHlsZSBlbGVtZW50LlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYWRkU3R5bGVTaGVldChvd25lckRvY3VtZW50LCBjc3NUZXh0KSB7XHJcbiAgICAgICAgdmFyIHAgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKSxcclxuICAgICAgICAgIHBhcmVudCA9IG93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSB8fCBvd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcbiAgICAgICAgcC5pbm5lckhUTUwgPSAneDxzdHlsZT4nICsgY3NzVGV4dCArICc8L3N0eWxlPic7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudC5pbnNlcnRCZWZvcmUocC5sYXN0Q2hpbGQsIHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGBodG1sNS5lbGVtZW50c2AgYXMgYW4gYXJyYXkuXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgb2Ygc2hpdmVkIGVsZW1lbnQgbm9kZSBuYW1lcy5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRzKCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50cyA9IGh0bWw1LmVsZW1lbnRzO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZWxlbWVudHMgPT0gJ3N0cmluZycgPyBlbGVtZW50cy5zcGxpdCgnICcpIDogZWxlbWVudHM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBFeHRlbmRzIHRoZSBidWlsdC1pbiBsaXN0IG9mIGh0bWw1IGVsZW1lbnRzXHJcbiAgICAgICAqIEBtZW1iZXJPZiBodG1sNVxyXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gbmV3RWxlbWVudHMgd2hpdGVzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvciBhcnJheSBvZiBuZXcgZWxlbWVudCBuYW1lcyB0byBzaGl2XHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGNvbnRleHQgZG9jdW1lbnQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBhZGRFbGVtZW50cyhuZXdFbGVtZW50cywgb3duZXJEb2N1bWVudCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50cyA9IGh0bWw1LmVsZW1lbnRzO1xyXG4gICAgICAgIGlmKHR5cGVvZiBlbGVtZW50cyAhPSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLmpvaW4oJyAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIG5ld0VsZW1lbnRzICE9ICdzdHJpbmcnKXtcclxuICAgICAgICAgIG5ld0VsZW1lbnRzID0gbmV3RWxlbWVudHMuam9pbignICcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sNS5lbGVtZW50cyA9IGVsZW1lbnRzICsnICcrIG5ld0VsZW1lbnRzO1xyXG4gICAgICAgIHNoaXZEb2N1bWVudChvd25lckRvY3VtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFJldHVybnMgdGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgZ2l2ZW4gZG9jdW1lbnRcclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBvZiBkYXRhLlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0RXhwYW5kb0RhdGEob3duZXJEb2N1bWVudCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gZXhwYW5kb0RhdGFbb3duZXJEb2N1bWVudFtleHBhbmRvXV07XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0ge307XHJcbiAgICAgICAgICBleHBhbklEKys7XHJcbiAgICAgICAgICBvd25lckRvY3VtZW50W2V4cGFuZG9dID0gZXhwYW5JRDtcclxuICAgICAgICAgIGV4cGFuZG9EYXRhW2V4cGFuSURdID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiByZXR1cm5zIGEgc2hpdmVkIGVsZW1lbnQgZm9yIHRoZSBnaXZlbiBub2RlTmFtZSBhbmQgZG9jdW1lbnRcclxuICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBub2RlTmFtZSBuYW1lIG9mIHRoZSBlbGVtZW50XHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGNvbnRleHQgZG9jdW1lbnQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzaGl2ZWQgZWxlbWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQobm9kZU5hbWUsIG93bmVyRG9jdW1lbnQsIGRhdGEpe1xyXG4gICAgICAgIGlmICghb3duZXJEb2N1bWVudCkge1xyXG4gICAgICAgICAgb3duZXJEb2N1bWVudCA9IGRvY3VtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdXBwb3J0c1Vua25vd25FbGVtZW50cyl7XHJcbiAgICAgICAgICByZXR1cm4gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gZ2V0RXhwYW5kb0RhdGEob3duZXJEb2N1bWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBub2RlO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5jYWNoZVtub2RlTmFtZV0pIHtcclxuICAgICAgICAgIG5vZGUgPSBkYXRhLmNhY2hlW25vZGVOYW1lXS5jbG9uZU5vZGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNhdmVDbG9uZXMudGVzdChub2RlTmFtZSkpIHtcclxuICAgICAgICAgIG5vZGUgPSAoZGF0YS5jYWNoZVtub2RlTmFtZV0gPSBkYXRhLmNyZWF0ZUVsZW0obm9kZU5hbWUpKS5jbG9uZU5vZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZSA9IGRhdGEuY3JlYXRlRWxlbShub2RlTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdm9pZCBhZGRpbmcgc29tZSBlbGVtZW50cyB0byBmcmFnbWVudHMgaW4gSUUgPCA5IGJlY2F1c2VcclxuICAgICAgICAvLyAqIEF0dHJpYnV0ZXMgbGlrZSBgbmFtZWAgb3IgYHR5cGVgIGNhbm5vdCBiZSBzZXQvY2hhbmdlZCBvbmNlIGFuIGVsZW1lbnRcclxuICAgICAgICAvLyAgIGlzIGluc2VydGVkIGludG8gYSBkb2N1bWVudC9mcmFnbWVudFxyXG4gICAgICAgIC8vICogTGluayBlbGVtZW50cyB3aXRoIGBzcmNgIGF0dHJpYnV0ZXMgdGhhdCBhcmUgaW5hY2Nlc3NpYmxlLCBhcyB3aXRoXHJcbiAgICAgICAgLy8gICBhIDQwMyByZXNwb25zZSwgd2lsbCBjYXVzZSB0aGUgdGFiL3dpbmRvdyB0byBjcmFzaFxyXG4gICAgICAgIC8vICogU2NyaXB0IGVsZW1lbnRzIGFwcGVuZGVkIHRvIGZyYWdtZW50cyB3aWxsIGV4ZWN1dGUgd2hlbiB0aGVpciBgc3JjYFxyXG4gICAgICAgIC8vICAgb3IgYHRleHRgIHByb3BlcnR5IGlzIHNldFxyXG4gICAgICAgIHJldHVybiBub2RlLmNhbkhhdmVDaGlsZHJlbiAmJiAhcmVTa2lwLnRlc3Qobm9kZU5hbWUpICYmICFub2RlLnRhZ1VybiA/IGRhdGEuZnJhZy5hcHBlbmRDaGlsZChub2RlKSA6IG5vZGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiByZXR1cm5zIGEgc2hpdmVkIERvY3VtZW50RnJhZ21lbnQgZm9yIHRoZSBnaXZlbiBkb2N1bWVudFxyXG4gICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgY29udGV4dCBkb2N1bWVudC5cclxuICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHNoaXZlZCBEb2N1bWVudEZyYWdtZW50LlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlRG9jdW1lbnRGcmFnbWVudChvd25lckRvY3VtZW50LCBkYXRhKXtcclxuICAgICAgICBpZiAoIW93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICAgIG93bmVyRG9jdW1lbnQgPSBkb2N1bWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3VwcG9ydHNVbmtub3duRWxlbWVudHMpe1xyXG4gICAgICAgICAgcmV0dXJuIG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhID0gZGF0YSB8fCBnZXRFeHBhbmRvRGF0YShvd25lckRvY3VtZW50KTtcclxuICAgICAgICB2YXIgY2xvbmUgPSBkYXRhLmZyYWcuY2xvbmVOb2RlKCksXHJcbiAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgIGVsZW1zID0gZ2V0RWxlbWVudHMoKSxcclxuICAgICAgICAgIGwgPSBlbGVtcy5sZW5ndGg7XHJcbiAgICAgICAgZm9yKDtpPGw7aSsrKXtcclxuICAgICAgICAgIGNsb25lLmNyZWF0ZUVsZW1lbnQoZWxlbXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTaGl2cyB0aGUgYGNyZWF0ZUVsZW1lbnRgIGFuZCBgY3JlYXRlRG9jdW1lbnRGcmFnbWVudGAgbWV0aG9kcyBvZiB0aGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIG9mIHRoZSBkb2N1bWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHNoaXZNZXRob2RzKG93bmVyRG9jdW1lbnQsIGRhdGEpIHtcclxuICAgICAgICBpZiAoIWRhdGEuY2FjaGUpIHtcclxuICAgICAgICAgIGRhdGEuY2FjaGUgPSB7fTtcclxuICAgICAgICAgIGRhdGEuY3JlYXRlRWxlbSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudDtcclxuICAgICAgICAgIGRhdGEuY3JlYXRlRnJhZyA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudDtcclxuICAgICAgICAgIGRhdGEuZnJhZyA9IGRhdGEuY3JlYXRlRnJhZygpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKG5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAvL2Fib3J0IHNoaXZcclxuICAgICAgICAgIGlmICghaHRtbDUuc2hpdk1ldGhvZHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY3JlYXRlRWxlbShub2RlTmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gY3JlYXRlRWxlbWVudChub2RlTmFtZSwgb3duZXJEb2N1bWVudCwgZGF0YSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50ID0gRnVuY3Rpb24oJ2gsZicsICdyZXR1cm4gZnVuY3Rpb24oKXsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaC5zaGl2TWV0aG9kcyYmKCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVucm9sbCB0aGUgYGNyZWF0ZUVsZW1lbnRgIGNhbGxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RWxlbWVudHMoKS5qb2luKCkucmVwbGFjZSgvW1xcd1xcLTpdKy9nLCBmdW5jdGlvbihub2RlTmFtZSkge1xyXG4gICAgICAgICAgZGF0YS5jcmVhdGVFbGVtKG5vZGVOYW1lKTtcclxuICAgICAgICAgIGRhdGEuZnJhZy5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcclxuICAgICAgICAgIHJldHVybiAnYyhcIicgKyBub2RlTmFtZSArICdcIiknO1xyXG4gICAgICAgIH0pICtcclxuICAgICAgICAgICcpO3JldHVybiBufSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkoaHRtbDUsIGRhdGEuZnJhZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFNoaXZzIHRoZSBnaXZlbiBkb2N1bWVudC5cclxuICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50IHRvIHNoaXYuXHJcbiAgICAgICAqIEByZXR1cm5zIHtEb2N1bWVudH0gVGhlIHNoaXZlZCBkb2N1bWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHNoaXZEb2N1bWVudChvd25lckRvY3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCFvd25lckRvY3VtZW50KSB7XHJcbiAgICAgICAgICBvd25lckRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0gZ2V0RXhwYW5kb0RhdGEob3duZXJEb2N1bWVudCk7XHJcblxyXG4gICAgICAgIGlmIChodG1sNS5zaGl2Q1NTICYmICFzdXBwb3J0c0h0bWw1U3R5bGVzICYmICFkYXRhLmhhc0NTUykge1xyXG4gICAgICAgICAgZGF0YS5oYXNDU1MgPSAhIWFkZFN0eWxlU2hlZXQob3duZXJEb2N1bWVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvcnJlY3RzIGJsb2NrIGRpc3BsYXkgbm90IGRlZmluZWQgaW4gSUU2LzcvOC85XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJ0aWNsZSxhc2lkZSxkaWFsb2csZmlnY2FwdGlvbixmaWd1cmUsZm9vdGVyLGhlYWRlcixoZ3JvdXAsbWFpbixuYXYsc2VjdGlvbntkaXNwbGF5OmJsb2NrfScgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyBzdHlsaW5nIG5vdCBwcmVzZW50IGluIElFNi83LzgvOVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21hcmt7YmFja2dyb3VuZDojRkYwO2NvbG9yOiMwMDB9JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWRlcyBub24tcmVuZGVyZWQgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZXtkaXNwbGF5Om5vbmV9J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXN1cHBvcnRzVW5rbm93bkVsZW1lbnRzKSB7XHJcbiAgICAgICAgICBzaGl2TWV0aG9kcyhvd25lckRvY3VtZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG93bmVyRG9jdW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBgaHRtbDVgIG9iamVjdCBpcyBleHBvc2VkIHNvIHRoYXQgbW9yZSBlbGVtZW50cyBjYW4gYmUgc2hpdmVkIGFuZFxyXG4gICAgICAgKiBleGlzdGluZyBzaGl2aW5nIGNhbiBiZSBkZXRlY3RlZCBvbiBpZnJhbWVzLlxyXG4gICAgICAgKiBAdHlwZSBPYmplY3RcclxuICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICpcclxuICAgICAgICogLy8gb3B0aW9ucyBjYW4gYmUgY2hhbmdlZCBiZWZvcmUgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZFxyXG4gICAgICAgKiBodG1sNSA9IHsgJ2VsZW1lbnRzJzogJ21hcmsgc2VjdGlvbicsICdzaGl2Q1NTJzogZmFsc2UsICdzaGl2TWV0aG9kcyc6IGZhbHNlIH07XHJcbiAgICAgICAqL1xyXG4gICAgICB2YXIgaHRtbDUgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFuIGFycmF5IG9yIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2Ygbm9kZSBuYW1lcyBvZiB0aGUgZWxlbWVudHMgdG8gc2hpdi5cclxuICAgICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICAgKiBAdHlwZSBBcnJheXxTdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICAnZWxlbWVudHMnOiBvcHRpb25zLmVsZW1lbnRzIHx8ICdhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHBpY3R1cmUgcHJvZ3Jlc3Mgc2VjdGlvbiBzdW1tYXJ5IHRlbXBsYXRlIHRpbWUgdmlkZW8nLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjdXJyZW50IHZlcnNpb24gb2YgaHRtbDVzaGl2XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ3ZlcnNpb24nOiB2ZXJzaW9uLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCB0aGUgSFRNTDUgc3R5bGUgc2hlZXQgc2hvdWxkIGJlIGluc2VydGVkLlxyXG4gICAgICAgICAqIEBtZW1iZXJPZiBodG1sNVxyXG4gICAgICAgICAqIEB0eXBlIEJvb2xlYW5cclxuICAgICAgICAgKi9cclxuICAgICAgICAnc2hpdkNTUyc6IChvcHRpb25zLnNoaXZDU1MgIT09IGZhbHNlKSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXMgZXF1YWwgdG8gdHJ1ZSBpZiBhIGJyb3dzZXIgc3VwcG9ydHMgY3JlYXRpbmcgdW5rbm93bi9IVE1MNSBlbGVtZW50c1xyXG4gICAgICAgICAqIEBtZW1iZXJPZiBodG1sNVxyXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cclxuICAgICAgICAgKi9cclxuICAgICAgICAnc3VwcG9ydHNVbmtub3duRWxlbWVudHMnOiBzdXBwb3J0c1Vua25vd25FbGVtZW50cyxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIGRvY3VtZW50J3MgYGNyZWF0ZUVsZW1lbnRgIGFuZCBgY3JlYXRlRG9jdW1lbnRGcmFnbWVudGBcclxuICAgICAgICAgKiBtZXRob2RzIHNob3VsZCBiZSBvdmVyd3JpdHRlbi5cclxuICAgICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICAgKiBAdHlwZSBCb29sZWFuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ3NoaXZNZXRob2RzJzogKG9wdGlvbnMuc2hpdk1ldGhvZHMgIT09IGZhbHNlKSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQSBzdHJpbmcgdG8gZGVzY3JpYmUgdGhlIHR5cGUgb2YgYGh0bWw1YCBvYmplY3QgKFwiZGVmYXVsdFwiIG9yIFwiZGVmYXVsdCBwcmludFwiKS5cclxuICAgICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICAgKiBAdHlwZSBTdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICAndHlwZSc6ICdkZWZhdWx0JyxcclxuXHJcbiAgICAgICAgLy8gc2hpdnMgdGhlIGRvY3VtZW50IGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGBodG1sNWAgb2JqZWN0IG9wdGlvbnNcclxuICAgICAgICAnc2hpdkRvY3VtZW50Jzogc2hpdkRvY3VtZW50LFxyXG5cclxuICAgICAgICAvL2NyZWF0ZXMgYSBzaGl2ZWQgZWxlbWVudFxyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnQsXHJcblxyXG4gICAgICAgIC8vY3JlYXRlcyBhIHNoaXZlZCBkb2N1bWVudEZyYWdtZW50XHJcbiAgICAgICAgY3JlYXRlRG9jdW1lbnRGcmFnbWVudDogY3JlYXRlRG9jdW1lbnRGcmFnbWVudCxcclxuXHJcbiAgICAgICAgLy9leHRlbmRzIGxpc3Qgb2YgZWxlbWVudHNcclxuICAgICAgICBhZGRFbGVtZW50czogYWRkRWxlbWVudHNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLy8gZXhwb3NlIGh0bWw1XHJcbiAgICAgIHdpbmRvdy5odG1sNSA9IGh0bWw1O1xyXG5cclxuICAgICAgLy8gc2hpdiB0aGUgZG9jdW1lbnRcclxuICAgICAgc2hpdkRvY3VtZW50KGRvY3VtZW50KTtcclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQcmludCBTaGl2IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLyoqIFVzZWQgdG8gZmlsdGVyIG1lZGlhIHR5cGVzICovXHJcbiAgICAgIHZhciByZU1lZGlhID0gL14kfFxcYig/OmFsbHxwcmludClcXGIvO1xyXG5cclxuICAgICAgLyoqIFVzZWQgdG8gbmFtZXNwYWNlIHByaW50YWJsZSBlbGVtZW50cyAqL1xyXG4gICAgICB2YXIgc2hpdk5hbWVzcGFjZSA9ICdodG1sNXNoaXYnO1xyXG5cclxuICAgICAgLyoqIERldGVjdCB3aGV0aGVyIHRoZSBicm93c2VyIHN1cHBvcnRzIHNoaXZhYmxlIHN0eWxlIHNoZWV0cyAqL1xyXG4gICAgICB2YXIgc3VwcG9ydHNTaGl2YWJsZVNoZWV0cyA9ICFzdXBwb3J0c1Vua25vd25FbGVtZW50cyAmJiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gYXNzaWduIGEgZmFsc2UgbmVnYXRpdmUgaWYgdW5hYmxlIHRvIHNoaXZcclxuICAgICAgICB2YXIgZG9jRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgICAgcmV0dXJuICEoXHJcbiAgICAgICAgICB0eXBlb2YgZG9jdW1lbnQubmFtZXNwYWNlcyA9PSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2YgZG9jdW1lbnQucGFyZW50V2luZG93ID09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBkb2NFbC5hcHBseUVsZW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHxcclxuICAgICAgICAgICAgdHlwZW9mIGRvY0VsLnJlbW92ZU5vZGUgPT0gJ3VuZGVmaW5lZCcgfHxcclxuICAgICAgICAgICAgdHlwZW9mIHdpbmRvdy5hdHRhY2hFdmVudCA9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH0oKSk7XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBXcmFwcyBhbGwgSFRNTDUgZWxlbWVudHMgaW4gdGhlIGdpdmVuIGRvY3VtZW50IHdpdGggcHJpbnRhYmxlIGVsZW1lbnRzLlxyXG4gICAgICAgKiAoZWcuIHRoZSBcImhlYWRlclwiIGVsZW1lbnQgaXMgd3JhcHBlZCB3aXRoIHRoZSBcImh0bWw1c2hpdjpoZWFkZXJcIiBlbGVtZW50KVxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBkb2N1bWVudC5cclxuICAgICAgICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSB3cmFwcGVycyBhZGRlZC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGFkZFdyYXBwZXJzKG93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICB2YXIgbm9kZSxcclxuICAgICAgICBub2RlcyA9IG93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJyonKSxcclxuICAgICAgICAgIGluZGV4ID0gbm9kZXMubGVuZ3RoLFxyXG4gICAgICAgICAgcmVFbGVtZW50cyA9IFJlZ0V4cCgnXig/OicgKyBnZXRFbGVtZW50cygpLmpvaW4oJ3wnKSArICcpJCcsICdpJyksXHJcbiAgICAgICAgICByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGluZGV4LS0pIHtcclxuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleF07XHJcbiAgICAgICAgICBpZiAocmVFbGVtZW50cy50ZXN0KG5vZGUubm9kZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUuYXBwbHlFbGVtZW50KGNyZWF0ZVdyYXBwZXIobm9kZSkpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIENyZWF0ZXMgYSBwcmludGFibGUgd3JhcHBlciBmb3IgdGhlIGdpdmVuIGVsZW1lbnQuXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudC5cclxuICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IFRoZSB3cmFwcGVyLlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIG5vZGUsXHJcbiAgICAgICAgbm9kZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICBpbmRleCA9IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgIHdyYXBwZXIgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChzaGl2TmFtZXNwYWNlICsgJzonICsgZWxlbWVudC5ub2RlTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGNvcHkgZWxlbWVudCBhdHRyaWJ1dGVzIHRvIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgd2hpbGUgKGluZGV4LS0pIHtcclxuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleF07XHJcbiAgICAgICAgICBub2RlLnNwZWNpZmllZCAmJiB3cmFwcGVyLnNldEF0dHJpYnV0ZShub2RlLm5vZGVOYW1lLCBub2RlLm5vZGVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvcHkgZWxlbWVudCBzdHlsZXMgdG8gdGhlIHdyYXBwZXJcclxuICAgICAgICB3cmFwcGVyLnN0eWxlLmNzc1RleHQgPSBlbGVtZW50LnN0eWxlLmNzc1RleHQ7XHJcbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTaGl2cyB0aGUgZ2l2ZW4gQ1NTIHRleHQuXHJcbiAgICAgICAqIChlZy4gaGVhZGVye30gYmVjb21lcyBodG1sNXNoaXZcXDpoZWFkZXJ7fSlcclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNzc1RleHQgVGhlIENTUyB0ZXh0IHRvIHNoaXYuXHJcbiAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzaGl2ZWQgQ1NTIHRleHQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaGl2Q3NzVGV4dChjc3NUZXh0KSB7XHJcbiAgICAgICAgdmFyIHBhaXIsXHJcbiAgICAgICAgcGFydHMgPSBjc3NUZXh0LnNwbGl0KCd7JyksXHJcbiAgICAgICAgICBpbmRleCA9IHBhcnRzLmxlbmd0aCxcclxuICAgICAgICAgIHJlRWxlbWVudHMgPSBSZWdFeHAoJyhefFtcXFxccyw+K35dKSgnICsgZ2V0RWxlbWVudHMoKS5qb2luKCd8JykgKyAnKSg/PVtbXFxcXHMsPit+Iy46XXwkKScsICdnaScpLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSAnJDEnICsgc2hpdk5hbWVzcGFjZSArICdcXFxcOiQyJztcclxuXHJcbiAgICAgICAgd2hpbGUgKGluZGV4LS0pIHtcclxuICAgICAgICAgIHBhaXIgPSBwYXJ0c1tpbmRleF0gPSBwYXJ0c1tpbmRleF0uc3BsaXQoJ30nKTtcclxuICAgICAgICAgIHBhaXJbcGFpci5sZW5ndGggLSAxXSA9IHBhaXJbcGFpci5sZW5ndGggLSAxXS5yZXBsYWNlKHJlRWxlbWVudHMsIHJlcGxhY2VtZW50KTtcclxuICAgICAgICAgIHBhcnRzW2luZGV4XSA9IHBhaXIuam9pbignfScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbigneycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gd3JhcHBlcnMsIGxlYXZpbmcgdGhlIG9yaWdpbmFsIGVsZW1lbnRzLlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcGFyYW1zIHtBcnJheX0gd3JhcHBlcnMgQW4gYXJyYXkgb2YgcHJpbnRhYmxlIHdyYXBwZXJzLlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlV3JhcHBlcnMod3JhcHBlcnMpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB3cmFwcGVycy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKGluZGV4LS0pIHtcclxuICAgICAgICAgIHdyYXBwZXJzW2luZGV4XS5yZW1vdmVOb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTaGl2cyB0aGUgZ2l2ZW4gZG9jdW1lbnQgZm9yIHByaW50LlxyXG4gICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQgdG8gc2hpdi5cclxuICAgICAgICogQHJldHVybnMge0RvY3VtZW50fSBUaGUgc2hpdmVkIGRvY3VtZW50LlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2hpdlByaW50KG93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICB2YXIgc2hpdmVkU2hlZXQsXHJcbiAgICAgICAgd3JhcHBlcnMsXHJcbiAgICAgICAgZGF0YSA9IGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpLFxyXG4gICAgICAgICAgbmFtZXNwYWNlcyA9IG93bmVyRG9jdW1lbnQubmFtZXNwYWNlcyxcclxuICAgICAgICAgIG93bmVyV2luZG93ID0gb3duZXJEb2N1bWVudC5wYXJlbnRXaW5kb3c7XHJcblxyXG4gICAgICAgIGlmICghc3VwcG9ydHNTaGl2YWJsZVNoZWV0cyB8fCBvd25lckRvY3VtZW50LnByaW50U2hpdmVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gb3duZXJEb2N1bWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VzW3NoaXZOYW1lc3BhY2VdID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBuYW1lc3BhY2VzLmFkZChzaGl2TmFtZXNwYWNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVNoZWV0KCkge1xyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuX3JlbW92ZVNoZWV0VGltZXIpO1xyXG4gICAgICAgICAgaWYgKHNoaXZlZFNoZWV0KSB7XHJcbiAgICAgICAgICAgIHNoaXZlZFNoZWV0LnJlbW92ZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzaGl2ZWRTaGVldD0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG93bmVyV2luZG93LmF0dGFjaEV2ZW50KCdvbmJlZm9yZXByaW50JywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgcmVtb3ZlU2hlZXQoKTtcclxuXHJcbiAgICAgICAgICB2YXIgaW1wb3J0cyxcclxuICAgICAgICAgIGxlbmd0aCxcclxuICAgICAgICAgIHNoZWV0LFxyXG4gICAgICAgICAgY29sbGVjdGlvbiA9IG93bmVyRG9jdW1lbnQuc3R5bGVTaGVldHMsXHJcbiAgICAgICAgICAgIGNzc1RleHQgPSBbXSxcclxuICAgICAgICAgICAgaW5kZXggPSBjb2xsZWN0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgc2hlZXRzID0gQXJyYXkoaW5kZXgpO1xyXG5cclxuICAgICAgICAgIC8vIGNvbnZlcnQgc3R5bGVTaGVldHMgY29sbGVjdGlvbiB0byBhbiBhcnJheVxyXG4gICAgICAgICAgd2hpbGUgKGluZGV4LS0pIHtcclxuICAgICAgICAgICAgc2hlZXRzW2luZGV4XSA9IGNvbGxlY3Rpb25baW5kZXhdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gY29uY2F0IGFsbCBzdHlsZSBzaGVldCBDU1MgdGV4dFxyXG4gICAgICAgICAgd2hpbGUgKChzaGVldCA9IHNoZWV0cy5wb3AoKSkpIHtcclxuICAgICAgICAgICAgLy8gSUUgZG9lcyBub3QgZW5mb3JjZSBhIHNhbWUgb3JpZ2luIHBvbGljeSBmb3IgZXh0ZXJuYWwgc3R5bGUgc2hlZXRzLi4uXHJcbiAgICAgICAgICAgIC8vIGJ1dCBoYXMgdHJvdWJsZSB3aXRoIHNvbWUgZHluYW1pY2FsbHkgY3JlYXRlZCBzdHlsZXNoZWV0c1xyXG4gICAgICAgICAgICBpZiAoIXNoZWV0LmRpc2FibGVkICYmIHJlTWVkaWEudGVzdChzaGVldC5tZWRpYSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGltcG9ydHMgPSBzaGVldC5pbXBvcnRzO1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gaW1wb3J0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgfSBjYXRjaChlcil7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBzaGVldHMucHVzaChpbXBvcnRzW2luZGV4XSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY3NzVGV4dC5wdXNoKHNoZWV0LmNzc1RleHQpO1xyXG4gICAgICAgICAgICAgIH0gY2F0Y2goZXIpe31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIHdyYXAgYWxsIEhUTUw1IGVsZW1lbnRzIHdpdGggcHJpbnRhYmxlIGVsZW1lbnRzIGFuZCBhZGQgdGhlIHNoaXZlZCBzdHlsZSBzaGVldFxyXG4gICAgICAgICAgY3NzVGV4dCA9IHNoaXZDc3NUZXh0KGNzc1RleHQucmV2ZXJzZSgpLmpvaW4oJycpKTtcclxuICAgICAgICAgIHdyYXBwZXJzID0gYWRkV3JhcHBlcnMob3duZXJEb2N1bWVudCk7XHJcbiAgICAgICAgICBzaGl2ZWRTaGVldCA9IGFkZFN0eWxlU2hlZXQob3duZXJEb2N1bWVudCwgY3NzVGV4dCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd25lcldpbmRvdy5hdHRhY2hFdmVudCgnb25hZnRlcnByaW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAvLyByZW1vdmUgd3JhcHBlcnMsIGxlYXZpbmcgdGhlIG9yaWdpbmFsIGVsZW1lbnRzLCBhbmQgcmVtb3ZlIHRoZSBzaGl2ZWQgc3R5bGUgc2hlZXRcclxuICAgICAgICAgIHJlbW92ZVdyYXBwZXJzKHdyYXBwZXJzKTtcclxuICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLl9yZW1vdmVTaGVldFRpbWVyKTtcclxuICAgICAgICAgIGRhdGEuX3JlbW92ZVNoZWV0VGltZXIgPSBzZXRUaW1lb3V0KHJlbW92ZVNoZWV0LCA1MDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd25lckRvY3VtZW50LnByaW50U2hpdmVkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gb3duZXJEb2N1bWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgICAvLyBleHBvc2UgQVBJXHJcbiAgICAgIGh0bWw1LnR5cGUgKz0gJyBwcmludCc7XHJcbiAgICAgIGh0bWw1LnNoaXZQcmludCA9IHNoaXZQcmludDtcclxuXHJcbiAgICAgIC8vIHNoaXYgZm9yIHByaW50XHJcbiAgICAgIHNoaXZQcmludChkb2N1bWVudCk7XHJcblxyXG4gICAgICBpZih0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKXtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGh0bWw1O1xyXG4gICAgICB9XHJcblxyXG4gICAgfSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdGhpcywgZG9jdW1lbnQpKTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGNvbnRhaW5zIGNoZWNrcyB0byBzZWUgaWYgYSBzdHJpbmcgY29udGFpbnMgYW5vdGhlciBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBjb250YWluc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHdlIHdhbnQgdG8gY2hlY2sgZm9yIHN1YnN0cmluZ3NcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3Vic3RyIC0gVGhlIHN1YnN0cmluZyB3ZSB3YW50IHRvIHNlYXJjaCB0aGUgZmlyc3Qgc3RyaW5nIGZvclxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBjb250YWlucyhzdHIsIHN1YnN0cikge1xyXG4gICAgcmV0dXJuICEhfignJyArIHN0cikuaW5kZXhPZihzdWJzdHIpO1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBjcmVhdGVFbGVtZW50IGlzIGEgY29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudC4gU2luY2Ugd2VcclxuICAgKiB1c2UgY3JlYXRlRWxlbWVudCBhbGwgb3ZlciB0aGUgcGxhY2UsIHRoaXMgYWxsb3dzIGZvciAoc2xpZ2h0bHkpIHNtYWxsZXIgY29kZVxyXG4gICAqIGFzIHdlbGwgYXMgYWJzdHJhY3RpbmcgYXdheSBpc3N1ZXMgd2l0aCBjcmVhdGluZyBlbGVtZW50cyBpbiBjb250ZXh0cyBvdGhlciB0aGFuXHJcbiAgICogSFRNTCBkb2N1bWVudHMgKGUuZy4gU1ZHIGRvY3VtZW50cykuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gY3JlYXRlRWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBBbiBIVE1MIG9yIFNWRyBlbGVtZW50XHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSBpbiBJRTcsIHdoZXJlIHRoZSB0eXBlIG9mIGNyZWF0ZUVsZW1lbnQgaXMgXCJvYmplY3RcIi5cclxuICAgICAgLy8gRm9yIHRoaXMgcmVhc29uLCB3ZSBjYW5ub3QgY2FsbCBhcHBseSgpIGFzIE9iamVjdCBpcyBub3QgYSBGdW5jdGlvbi5cclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTtcclxuICAgIH0gZWxzZSBpZiAoaXNTVkcpIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUy5jYWxsKGRvY3VtZW50LCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBhcmd1bWVudHNbMF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBvdXIgXCJtb2Rlcm5penJcIiBlbGVtZW50IHRoYXQgd2UgZG8gbW9zdCBmZWF0dXJlIHRlc3RzIG9uLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICovXHJcblxyXG4gIHZhciBtb2RFbGVtID0ge1xyXG4gICAgZWxlbTogY3JlYXRlRWxlbWVudCgnbW9kZXJuaXpyJylcclxuICB9O1xyXG5cclxuICAvLyBDbGVhbiB1cCB0aGlzIGVsZW1lbnRcclxuICBNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSBtb2RFbGVtLmVsZW07XHJcbiAgfSk7XHJcblxyXG4gIFxyXG5cclxuICB2YXIgbVN0eWxlID0ge1xyXG4gICAgc3R5bGU6IG1vZEVsZW0uZWxlbS5zdHlsZVxyXG4gIH07XHJcblxyXG4gIC8vIGtpbGwgcmVmIGZvciBnYywgbXVzdCBoYXBwZW4gYmVmb3JlIG1vZC5lbGVtIGlzIHJlbW92ZWQsIHNvIHdlIHVuc2hpZnQgb24gdG9cclxuICAvLyB0aGUgZnJvbnQgb2YgdGhlIHF1ZXVlLlxyXG4gIE1vZGVybml6ci5fcS51bnNoaWZ0KGZ1bmN0aW9uKCkge1xyXG4gICAgZGVsZXRlIG1TdHlsZS5zdHlsZTtcclxuICB9KTtcclxuXHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICAqIGdldEJvZHkgcmV0dXJucyB0aGUgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhbiBlbGVtZW50IHRoYXQgY2FuIHN0YW5kIGluIGZvclxyXG4gICAqIHRoZSBib2R5IGlmIGEgcmVhbCBib2R5IGRvZXMgbm90IGV4aXN0XHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gZ2V0Qm9keVxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBSZXR1cm5zIHRoZSByZWFsIGJvZHkgb2YgYSBkb2N1bWVudCwgb3IgYW5cclxuICAgKiBhcnRpZmljaWFsbHkgY3JlYXRlZCBlbGVtZW50IHRoYXQgc3RhbmRzIGluIGZvciB0aGUgYm9keVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBnZXRCb2R5KCkge1xyXG4gICAgLy8gQWZ0ZXIgcGFnZSBsb2FkIGluamVjdGluZyBhIGZha2UgYm9keSBkb2Vzbid0IHdvcmsgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgICBpZiAoIWJvZHkpIHtcclxuICAgICAgLy8gQ2FuJ3QgdXNlIHRoZSByZWFsIGJvZHkgY3JlYXRlIGEgZmFrZSBvbmUuXHJcbiAgICAgIGJvZHkgPSBjcmVhdGVFbGVtZW50KGlzU1ZHID8gJ3N2ZycgOiAnYm9keScpO1xyXG4gICAgICBib2R5LmZha2UgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib2R5O1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBpbmplY3RFbGVtZW50V2l0aFN0eWxlcyBpbmplY3RzIGFuIGVsZW1lbnQgd2l0aCBzdHlsZSBlbGVtZW50IGFuZCBzb21lIENTUyBydWxlc1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIGEgY3NzIHJ1bGVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHRlc3QgdGhlIGluamVjdGVkIGVsZW1lbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVzXSAtIEFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBub2RlcyB5b3Ugd2FudCBpbmplY3RlZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFt0ZXN0bmFtZXNdIC0gQW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGFyZSB1c2VkIGFzIGlkcyBmb3IgdGhlIGFkZGl0aW9uYWwgbm9kZXNcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMocnVsZSwgY2FsbGJhY2ssIG5vZGVzLCB0ZXN0bmFtZXMpIHtcclxuICAgIHZhciBtb2QgPSAnbW9kZXJuaXpyJztcclxuICAgIHZhciBzdHlsZTtcclxuICAgIHZhciByZXQ7XHJcbiAgICB2YXIgbm9kZTtcclxuICAgIHZhciBkb2NPdmVyZmxvdztcclxuICAgIHZhciBkaXYgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZhciBib2R5ID0gZ2V0Qm9keSgpO1xyXG5cclxuICAgIGlmIChwYXJzZUludChub2RlcywgMTApKSB7XHJcbiAgICAgIC8vIEluIG9yZGVyIG5vdCB0byBnaXZlIGZhbHNlIHBvc2l0aXZlcyB3ZSBjcmVhdGUgYSBub2RlIGZvciBlYWNoIHRlc3RcclxuICAgICAgLy8gVGhpcyBhbHNvIGFsbG93cyB0aGUgbWV0aG9kIHRvIHNjYWxlIGZvciB1bnNwZWNpZmllZCB1c2VzXHJcbiAgICAgIHdoaWxlIChub2Rlcy0tKSB7XHJcbiAgICAgICAgbm9kZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG5vZGUuaWQgPSB0ZXN0bmFtZXMgPyB0ZXN0bmFtZXNbbm9kZXNdIDogbW9kICsgKG5vZGVzICsgMSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICBzdHlsZS5pZCA9ICdzJyArIG1vZDtcclxuXHJcbiAgICAvLyBJRTYgd2lsbCBmYWxzZSBwb3NpdGl2ZSBvbiBzb21lIHRlc3RzIGR1ZSB0byB0aGUgc3R5bGUgZWxlbWVudCBpbnNpZGUgdGhlIHRlc3QgZGl2IHNvbWVob3cgaW50ZXJmZXJpbmcgb2Zmc2V0SGVpZ2h0LCBzbyBpbnNlcnQgaXQgaW50byBib2R5IG9yIGZha2Vib2R5LlxyXG4gICAgLy8gT3BlcmEgd2lsbCBhY3QgYWxsIHF1aXJreSB3aGVuIGluamVjdGluZyBlbGVtZW50cyBpbiBkb2N1bWVudEVsZW1lbnQgd2hlbiBwYWdlIGlzIHNlcnZlZCBhcyB4bWwsIG5lZWRzIGZha2Vib2R5IHRvby4gIzI3MFxyXG4gICAgKCFib2R5LmZha2UgPyBkaXYgOiBib2R5KS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcclxuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcnVsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcclxuICAgIH1cclxuICAgIGRpdi5pZCA9IG1vZDtcclxuXHJcbiAgICBpZiAoYm9keS5mYWtlKSB7XHJcbiAgICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcclxuICAgICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XHJcbiAgICAgIC8vU2FmYXJpIDUuMTMvNS4xLjQgT1NYIHN0b3BzIGxvYWRpbmcgaWYgOjotd2Via2l0LXNjcm9sbGJhciBpcyB1c2VkIGFuZCBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlXHJcbiAgICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgZG9jT3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93O1xyXG4gICAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0ID0gY2FsbGJhY2soZGl2LCBydWxlKTtcclxuICAgIC8vIElmIHRoaXMgaXMgZG9uZSBhZnRlciBwYWdlIGxvYWQgd2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGJvZHkgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcclxuICAgIGlmIChib2R5LmZha2UpIHtcclxuICAgICAgYm9keS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvZHkpO1xyXG4gICAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gZG9jT3ZlcmZsb3c7XHJcbiAgICAgIC8vIFRyaWdnZXIgbGF5b3V0IHNvIGtpbmV0aWMgc2Nyb2xsaW5nIGlzbid0IGRpc2FibGVkIGluIGlPUzYrXHJcbiAgICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gISFyZXQ7XHJcblxyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBkb21Ub0NTUyB0YWtlcyBhIGNhbWVsQ2FzZSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IHRvIGtlYmFiLWNhc2VcclxuICAgKiBlLmcuIGJveFNpemluZyAtPiBib3gtc2l6aW5nXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gZG9tVG9DU1NcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFN0cmluZyBuYW1lIG9mIGNhbWVsQ2FzZSBwcm9wIHdlIHdhbnQgdG8gY29udmVydFxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBrZWJhYi1jYXNlIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIG5hbWVcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZG9tVG9DU1MobmFtZSkge1xyXG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbihzdHIsIG0xKSB7XHJcbiAgICAgIHJldHVybiAnLScgKyBtMS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfSkucmVwbGFjZSgvXm1zLS8sICctbXMtJyk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogbmF0aXZlVGVzdFByb3BzIGFsbG93cyBmb3IgdXMgdG8gdXNlIG5hdGl2ZSBmZWF0dXJlIGRldGVjdGlvbiBmdW5jdGlvbmFsaXR5IGlmIGF2YWlsYWJsZS5cclxuICAgKiBzb21lIHByZWZpeGVkIGZvcm0sIG9yIGZhbHNlLCBpbiB0aGUgY2FzZSBvZiBhbiB1bnN1cHBvcnRlZCBydWxlXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gbmF0aXZlVGVzdFByb3BzXHJcbiAgICogQHBhcmFtIHthcnJheX0gcHJvcHMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgd2Ugd2FudCB0byBjaGVjayB2aWEgQHN1cHBvcnRzXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW58dW5kZWZpbmVkfSBBIGJvb2xlYW4gd2hlbiBAc3VwcG9ydHMgZXhpc3RzLCB1bmRlZmluZWQgb3RoZXJ3aXNlXHJcbiAgICovXHJcblxyXG4gIC8vIEFjY2VwdHMgYSBsaXN0IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBhIHNpbmdsZSB2YWx1ZVxyXG4gIC8vIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbmF0aXZlIGRldGVjdGlvbiBub3QgYXZhaWxhYmxlXHJcbiAgZnVuY3Rpb24gbmF0aXZlVGVzdFByb3BzKHByb3BzLCB2YWx1ZSkge1xyXG4gICAgdmFyIGkgPSBwcm9wcy5sZW5ndGg7XHJcbiAgICAvLyBTdGFydCB3aXRoIHRoZSBKUyBBUEk6IGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29uZGl0aW9uYWwvI3RoZS1jc3MtaW50ZXJmYWNlXHJcbiAgICBpZiAoJ0NTUycgaW4gd2luZG93ICYmICdzdXBwb3J0cycgaW4gd2luZG93LkNTUykge1xyXG4gICAgICAvLyBUcnkgZXZlcnkgcHJlZml4ZWQgdmFyaWFudCBvZiB0aGUgcHJvcGVydHlcclxuICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuQ1NTLnN1cHBvcnRzKGRvbVRvQ1NTKHByb3BzW2ldKSwgdmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gT3RoZXJ3aXNlIGZhbGwgYmFjayB0byBhdC1ydWxlIChmb3IgT3BlcmEgMTIueClcclxuICAgIGVsc2UgaWYgKCdDU1NTdXBwb3J0c1J1bGUnIGluIHdpbmRvdykge1xyXG4gICAgICAvLyBCdWlsZCBhIGNvbmRpdGlvbiBzdHJpbmcgZm9yIGV2ZXJ5IHByZWZpeGVkIHZhcmlhbnRcclxuICAgICAgdmFyIGNvbmRpdGlvblRleHQgPSBbXTtcclxuICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgIGNvbmRpdGlvblRleHQucHVzaCgnKCcgKyBkb21Ub0NTUyhwcm9wc1tpXSkgKyAnOicgKyB2YWx1ZSArICcpJyk7XHJcbiAgICAgIH1cclxuICAgICAgY29uZGl0aW9uVGV4dCA9IGNvbmRpdGlvblRleHQuam9pbignIG9yICcpO1xyXG4gICAgICByZXR1cm4gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMoJ0BzdXBwb3J0cyAoJyArIGNvbmRpdGlvblRleHQgKyAnKSB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfScsIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5wb3NpdGlvbiA9PSAnYWJzb2x1dGUnO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogY3NzVG9ET00gdGFrZXMgYSBrZWJhYi1jYXNlIHN0cmluZyBhbmQgY29udmVydHMgaXQgdG8gY2FtZWxDYXNlXHJcbiAgICogZS5nLiBib3gtc2l6aW5nIC0+IGJveFNpemluZ1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGNzc1RvRE9NXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBTdHJpbmcgbmFtZSBvZiBrZWJhYi1jYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhbWVsQ2FzZSB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBuYW1lXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGNzc1RvRE9NKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbYS16XSktKFthLXpdKS9nLCBmdW5jdGlvbihzdHIsIG0xLCBtMikge1xyXG4gICAgICByZXR1cm4gbTEgKyBtMi50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfSkucmVwbGFjZSgvXi0vLCAnJyk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLy8gdGVzdFByb3BzIGlzIGEgZ2VuZXJpYyBDU1MgLyBET00gcHJvcGVydHkgdGVzdC5cclxuXHJcbiAgLy8gSW4gdGVzdGluZyBzdXBwb3J0IGZvciBhIGdpdmVuIENTUyBwcm9wZXJ0eSwgaXQncyBsZWdpdCB0byB0ZXN0OlxyXG4gIC8vICAgIGBlbGVtLnN0eWxlW3N0eWxlTmFtZV0gIT09IHVuZGVmaW5lZGBcclxuICAvLyBJZiB0aGUgcHJvcGVydHkgaXMgc3VwcG9ydGVkIGl0IHdpbGwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyxcclxuICAvLyBpZiB1bnN1cHBvcnRlZCBpdCB3aWxsIHJldHVybiB1bmRlZmluZWQuXHJcblxyXG4gIC8vIFdlJ2xsIHRha2UgYWR2YW50YWdlIG9mIHRoaXMgcXVpY2sgdGVzdCBhbmQgc2tpcCBzZXR0aW5nIGEgc3R5bGVcclxuICAvLyBvbiBvdXIgbW9kZXJuaXpyIGVsZW1lbnQsIGJ1dCBpbnN0ZWFkIGp1c3QgdGVzdGluZyB1bmRlZmluZWQgdnNcclxuICAvLyBlbXB0eSBzdHJpbmcuXHJcblxyXG4gIC8vIFByb3BlcnR5IG5hbWVzIGNhbiBiZSBwcm92aWRlZCBpbiBlaXRoZXIgY2FtZWxDYXNlIG9yIGtlYmFiLWNhc2UuXHJcblxyXG4gIGZ1bmN0aW9uIHRlc3RQcm9wcyhwcm9wcywgcHJlZml4ZWQsIHZhbHVlLCBza2lwVmFsdWVUZXN0KSB7XHJcbiAgICBza2lwVmFsdWVUZXN0ID0gaXMoc2tpcFZhbHVlVGVzdCwgJ3VuZGVmaW5lZCcpID8gZmFsc2UgOiBza2lwVmFsdWVUZXN0O1xyXG5cclxuICAgIC8vIFRyeSBuYXRpdmUgZGV0ZWN0IGZpcnN0XHJcbiAgICBpZiAoIWlzKHZhbHVlLCAndW5kZWZpbmVkJykpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IG5hdGl2ZVRlc3RQcm9wcyhwcm9wcywgdmFsdWUpO1xyXG4gICAgICBpZiAoIWlzKHJlc3VsdCwgJ3VuZGVmaW5lZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE90aGVyd2lzZSBkbyBpdCBwcm9wZXJseVxyXG4gICAgdmFyIGFmdGVySW5pdCwgaSwgcHJvcHNMZW5ndGgsIHByb3AsIGJlZm9yZTtcclxuXHJcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3R5bGUgZWxlbWVudCwgdGhhdCBtZWFucyB3ZSdyZSBydW5uaW5nIGFzeW5jIG9yIGFmdGVyXHJcbiAgICAvLyB0aGUgY29yZSB0ZXN0cywgc28gd2UnbGwgbmVlZCB0byBjcmVhdGUgb3VyIG93biBlbGVtZW50cyB0byB1c2VcclxuXHJcbiAgICAvLyBpbnNpZGUgb2YgYW4gU1ZHIGVsZW1lbnQsIGluIGNlcnRhaW4gYnJvd3NlcnMsIHRoZSBgc3R5bGVgIGVsZW1lbnQgaXMgb25seVxyXG4gICAgLy8gZGVmaW5lZCBmb3IgdmFsaWQgdGFncy4gVGhlcmVmb3JlLCBpZiBgbW9kZXJuaXpyYCBkb2VzIG5vdCBoYXZlIG9uZSwgd2VcclxuICAgIC8vIGZhbGwgYmFjayB0byBhIGxlc3MgdXNlZCBlbGVtZW50IGFuZCBob3BlIGZvciB0aGUgYmVzdC5cclxuICAgIHZhciBlbGVtcyA9IFsnbW9kZXJuaXpyJywgJ3RzcGFuJ107XHJcbiAgICB3aGlsZSAoIW1TdHlsZS5zdHlsZSkge1xyXG4gICAgICBhZnRlckluaXQgPSB0cnVlO1xyXG4gICAgICBtU3R5bGUubW9kRWxlbSA9IGNyZWF0ZUVsZW1lbnQoZWxlbXMuc2hpZnQoKSk7XHJcbiAgICAgIG1TdHlsZS5zdHlsZSA9IG1TdHlsZS5tb2RFbGVtLnN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlbGV0ZSB0aGUgb2JqZWN0cyBpZiB3ZSBjcmVhdGVkIHRoZW0uXHJcbiAgICBmdW5jdGlvbiBjbGVhbkVsZW1zKCkge1xyXG4gICAgICBpZiAoYWZ0ZXJJbml0KSB7XHJcbiAgICAgICAgZGVsZXRlIG1TdHlsZS5zdHlsZTtcclxuICAgICAgICBkZWxldGUgbVN0eWxlLm1vZEVsZW07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHByb3AgPSBwcm9wc1tpXTtcclxuICAgICAgYmVmb3JlID0gbVN0eWxlLnN0eWxlW3Byb3BdO1xyXG5cclxuICAgICAgaWYgKGNvbnRhaW5zKHByb3AsICctJykpIHtcclxuICAgICAgICBwcm9wID0gY3NzVG9ET00ocHJvcCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtU3R5bGUuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAvLyBJZiB2YWx1ZSB0byB0ZXN0IGhhcyBiZWVuIHBhc3NlZCBpbiwgZG8gYSBzZXQtYW5kLWNoZWNrIHRlc3QuXHJcbiAgICAgICAgLy8gMCAoaW50ZWdlcikgaXMgYSB2YWxpZCBwcm9wZXJ0eSB2YWx1ZSwgc28gY2hlY2sgdGhhdCBgdmFsdWVgIGlzbid0XHJcbiAgICAgICAgLy8gdW5kZWZpbmVkLCByYXRoZXIgdGhhbiBqdXN0IGNoZWNraW5nIGl0J3MgdHJ1dGh5LlxyXG4gICAgICAgIGlmICghc2tpcFZhbHVlVGVzdCAmJiAhaXModmFsdWUsICd1bmRlZmluZWQnKSkge1xyXG5cclxuICAgICAgICAgIC8vIE5lZWRzIGEgdHJ5IGNhdGNoIGJsb2NrIGJlY2F1c2Ugb2Ygb2xkIElFLiBUaGlzIGlzIHNsb3csIGJ1dCB3aWxsXHJcbiAgICAgICAgICAvLyBiZSBhdm9pZGVkIGluIG1vc3QgY2FzZXMgYmVjYXVzZSBgc2tpcFZhbHVlVGVzdGAgd2lsbCBiZSB1c2VkLlxyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbVN0eWxlLnN0eWxlW3Byb3BdID0gdmFsdWU7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBoYXMgY2hhbmdlZCwgd2UgYXNzdW1lIHRoZSB2YWx1ZSB1c2VkIGlzXHJcbiAgICAgICAgICAvLyBzdXBwb3J0ZWQuIElmIGB2YWx1ZWAgaXMgZW1wdHkgc3RyaW5nLCBpdCdsbCBmYWlsIGhlcmUgKGJlY2F1c2VcclxuICAgICAgICAgIC8vIGl0IGhhc24ndCBjaGFuZ2VkKSwgd2hpY2ggbWF0Y2hlcyBob3cgYnJvd3NlcnMgaGF2ZSBpbXBsZW1lbnRlZFxyXG4gICAgICAgICAgLy8gQ1NTLnN1cHBvcnRzKClcclxuICAgICAgICAgIGlmIChtU3R5bGUuc3R5bGVbcHJvcF0gIT0gYmVmb3JlKSB7XHJcbiAgICAgICAgICAgIGNsZWFuRWxlbXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByZWZpeGVkID09ICdwZngnID8gcHJvcCA6IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE90aGVyd2lzZSBqdXN0IHJldHVybiB0cnVlLCBvciB0aGUgcHJvcGVydHkgbmFtZSBpZiB0aGlzIGlzIGFcclxuICAgICAgICAvLyBgcHJlZml4ZWQoKWAgY2FsbFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY2xlYW5FbGVtcygpO1xyXG4gICAgICAgICAgcmV0dXJuIHByZWZpeGVkID09ICdwZngnID8gcHJvcCA6IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhbkVsZW1zKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIHRlc3RQcm9wKCkgaW52ZXN0aWdhdGVzIHdoZXRoZXIgYSBnaXZlbiBzdHlsZSBwcm9wZXJ0eSBpcyByZWNvZ25pemVkXHJcbiAgICogUHJvcGVydHkgbmFtZXMgY2FuIGJlIHByb3ZpZGVkIGluIGVpdGhlciBjYW1lbENhc2Ugb3Iga2ViYWItY2FzZS5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcclxuICAgKiBAbmFtZSBNb2Rlcm5penIudGVzdFByb3BcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci50ZXN0UHJvcCgpXHJcbiAgICogQG9wdGlvblByb3AgdGVzdFByb3BcclxuICAgKiBAZnVuY3Rpb24gdGVzdFByb3BcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIE5hbWUgb2YgdGhlIENTUyBwcm9wZXJ0eSB0byBjaGVja1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gTmFtZSBvZiB0aGUgQ1NTIHZhbHVlIHRvIGNoZWNrXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbdXNlVmFsdWVdIC0gV2hldGhlciBvciBub3QgdG8gY2hlY2sgdGhlIHZhbHVlIGlmIEBzdXBwb3J0cyBpc24ndCBzdXBwb3J0ZWRcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKiBAZXhhbXBsZVxyXG4gICAqXHJcbiAgICogSnVzdCBsaWtlIFt0ZXN0QWxsUHJvcHNdKCNtb2Rlcm5penItdGVzdGFsbHByb3BzKSwgb25seSBpdCBkb2VzIG5vdCBjaGVjayBhbnkgdmVuZG9yIHByZWZpeGVkXHJcbiAgICogdmVyc2lvbiBvZiB0aGUgc3RyaW5nLlxyXG4gICAqXHJcbiAgICogTm90ZSB0aGF0IHRoZSBwcm9wZXJ0eSBuYW1lIG11c3QgYmUgcHJvdmlkZWQgaW4gY2FtZWxDYXNlIChlLmcuIGJveFNpemluZyBub3QgYm94LXNpemluZylcclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLnRlc3RQcm9wKCdwb2ludGVyRXZlbnRzJykgIC8vIHRydWVcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIFlvdSBjYW4gYWxzbyBwcm92aWRlIGEgdmFsdWUgYXMgYW4gb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGNoZWNrIGlmIGFcclxuICAgKiBzcGVjaWZpYyB2YWx1ZSBpcyBzdXBwb3J0ZWRcclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLnRlc3RQcm9wKCdwb2ludGVyRXZlbnRzJywgJ25vbmUnKSAvLyB0cnVlXHJcbiAgICogTW9kZXJuaXpyLnRlc3RQcm9wKCdwb2ludGVyRXZlbnRzJywgJ3Blbmd1aW4nKSAvLyBmYWxzZVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG5cclxuICB2YXIgdGVzdFByb3AgPSBNb2Rlcm5penJQcm90by50ZXN0UHJvcCA9IGZ1bmN0aW9uKHByb3AsIHZhbHVlLCB1c2VWYWx1ZSkge1xyXG4gICAgcmV0dXJuIHRlc3RQcm9wcyhbcHJvcF0sIHVuZGVmaW5lZCwgdmFsdWUsIHVzZVZhbHVlKTtcclxuICB9O1xyXG4gIFxyXG5cclxuICAvKipcclxuICAgKiBmbkJpbmQgaXMgYSBzdXBlciBzbWFsbCBbYmluZF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vYmluZCkgcG9seWZpbGwuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gZm5CaW5kXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBhIGZ1bmN0aW9uIHlvdSB3YW50IHRvIGNoYW5nZSBgdGhpc2AgcmVmZXJlbmNlIHRvXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRoYXQgLSB0aGUgYHRoaXNgIHlvdSB3YW50IHRvIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGhcclxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259IFRoZSB3cmFwcGVkIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIGZ1bmN0aW9uXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGZuQmluZChmbiwgdGhhdCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICA7XHJcbi8qIVxyXG57XHJcbiAgXCJuYW1lXCI6IFwiQ29va2llc1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJjb29raWVzXCIsXHJcbiAgXCJ0YWdzXCI6IFtcInN0b3JhZ2VcIl0sXHJcbiAgXCJhdXRob3JzXCI6IFtcInRhdXJlblwiXVxyXG59XHJcbiEqL1xyXG4vKiBET0NcclxuRGV0ZWN0cyB3aGV0aGVyIGNvb2tpZSBzdXBwb3J0IGlzIGVuYWJsZWQuXHJcbiovXHJcblxyXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8xOTFcclxuXHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nvb2tpZXMnLCBmdW5jdGlvbigpIHtcclxuICAgIC8vIG5hdmlnYXRvci5jb29raWVFbmFibGVkIGNhbm5vdCBkZXRlY3QgY3VzdG9tIG9yIG51YW5jZWQgY29va2llIGJsb2NraW5nXHJcbiAgICAvLyBjb25maWd1cmF0aW9ucy4gRm9yIGV4YW1wbGUsIHdoZW4gYmxvY2tpbmcgY29va2llcyB2aWEgdGhlIEFkdmFuY2VkXHJcbiAgICAvLyBQcml2YWN5IFNldHRpbmdzIGluIElFOSwgaXQgYWx3YXlzIHJldHVybnMgdHJ1ZS4gQW5kIHRoZXJlIGhhdmUgYmVlblxyXG4gICAgLy8gaXNzdWVzIGluIHRoZSBwYXN0IHdpdGggc2l0ZS1zcGVjaWZpYyBleGNlcHRpb25zLlxyXG4gICAgLy8gRG9uJ3QgcmVseSBvbiBpdC5cclxuXHJcbiAgICAvLyB0cnkuLmNhdGNoIGJlY2F1c2Ugc29tZSBpbiBzaXR1YXRpb25zIGBkb2N1bWVudC5jb29raWVgIGlzIGV4cG9zZWQgYnV0IHRocm93cyBhXHJcbiAgICAvLyBTZWN1cml0eUVycm9yIGlmIHlvdSB0cnkgdG8gYWNjZXNzIGl0OyBlLmcuIGRvY3VtZW50cyBjcmVhdGVkIGZyb20gZGF0YSBVUklzXHJcbiAgICAvLyBvciBpbiBzYW5kYm94ZWQgaWZyYW1lcyAoZGVwZW5kaW5nIG9uIGZsYWdzL2NvbnRleHQpXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBDcmVhdGUgY29va2llXHJcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdjb29raWV0ZXN0PTEnO1xyXG4gICAgICB2YXIgcmV0ID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoJ2Nvb2tpZXRlc3Q9JykgIT0gLTE7XHJcbiAgICAgIC8vIERlbGV0ZSBjb29raWVcclxuICAgICAgZG9jdW1lbnQuY29va2llID0gJ2Nvb2tpZXRlc3Q9MTsgZXhwaXJlcz1UaHUsIDAxLUphbi0xOTcwIDAwOjAwOjAxIEdNVCc7XHJcbiAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIlNWR1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJzdmdcIixcclxuICBcImNhbml1c2VcIjogXCJzdmdcIixcclxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxyXG4gIFwiYXV0aG9yc1wiOiBbXCJFcmlrIERhaGxzdHJvbVwiXSxcclxuICBcInBvbHlmaWxsc1wiOiBbXHJcbiAgICBcInN2Z3dlYlwiLFxyXG4gICAgXCJyYXBoYWVsXCIsXHJcbiAgICBcImFtcGxlc2RrXCIsXHJcbiAgICBcImNhbnZnXCIsXHJcbiAgICBcInN2Zy1ib2lsZXJwbGF0ZVwiLFxyXG4gICAgXCJzaWVcIixcclxuICAgIFwiZG9qb2dmeFwiLFxyXG4gICAgXCJmYWJyaWNqc1wiXHJcbiAgXVxyXG59XHJcbiEqL1xyXG4vKiBET0NcclxuRGV0ZWN0cyBzdXBwb3J0IGZvciBTVkcgaW4gYDxlbWJlZD5gIG9yIGA8b2JqZWN0PmAgZWxlbWVudHMuXHJcbiovXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdmcnLCAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJykuY3JlYXRlU1ZHUmVjdCk7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIlNWRyBhcyBhbiA8aW1nPiB0YWcgc291cmNlXCIsXHJcbiAgXCJwcm9wZXJ0eVwiOiBcInN2Z2FzaW1nXCIsXHJcbiAgXCJjYW5pdXNlXCIgOiBcInN2Zy1pbWdcIixcclxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxyXG4gIFwiYXV0aG9yc1wiOiBbXCJDaHJpcyBDb3lpZXJcIl0sXHJcbiAgXCJub3Rlc1wiOiBbe1xyXG4gICAgXCJuYW1lXCI6IFwiSFRNTDUgU3BlY1wiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvZW1iZWRkZWQtY29udGVudC0wLmh0bWwjdGhlLWltZy1lbGVtZW50XCJcclxuICB9XVxyXG59XHJcbiEqL1xyXG5cclxuXHJcbiAgLy8gT3JpZ2luYWwgQXN5bmMgdGVzdCBieSBTdHUgQ294XHJcbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vY2hyaXNjb3lpZXIvODc3NDUwMVxyXG5cclxuICAvLyBOb3cgYSBTeW5jIHRlc3QgYmFzZWQgb24gZ29vZCByZXN1bHRzIGhlcmVcclxuICAvLyBodHRwOi8vY29kZXBlbi5pby9jaHJpc2NveWllci9wZW4vYkFERnhcclxuXHJcbiAgLy8gTm90ZSBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlIGlzICpzdXBwb3NlZCogdG8gcmVwcmVzZW50XHJcbiAgLy8gc3VwcG9ydCBmb3IgdGhlIGA8aW1hZ2U+YCB0YWcgaW4gU1ZHLCBub3QgYW4gU1ZHIGZpbGUgbGlua2VkIGZyb20gYW4gYDxpbWc+YFxyXG4gIC8vIHRhZyBpbiBIVE1MIOKAkyBidXQgaXTigJlzIGEgaGV1cmlzdGljIHdoaWNoIHdvcmtzXHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N2Z2FzaW1nJywgZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZSgnaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZScsICcxLjEnKSk7XHJcblxyXG5cclxuICAvLyBSdW4gZWFjaCB0ZXN0XHJcbiAgdGVzdFJ1bm5lcigpO1xyXG5cclxuICBkZWxldGUgTW9kZXJuaXpyUHJvdG8uYWRkVGVzdDtcclxuICBkZWxldGUgTW9kZXJuaXpyUHJvdG8uYWRkQXN5bmNUZXN0O1xyXG5cclxuICAvLyBSdW4gdGhlIHRoaW5ncyB0aGF0IGFyZSBzdXBwb3NlZCB0byBydW4gYWZ0ZXIgdGhlIHRlc3RzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBNb2Rlcm5penIuX3EubGVuZ3RoOyBpKyspIHtcclxuICAgIE1vZGVybml6ci5fcVtpXSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGVhayBNb2Rlcm5penIgbmFtZXNwYWNlXHJcbiAgd2luZG93Lk1vZGVybml6ciA9IE1vZGVybml6cjtcclxuXHJcblxyXG47XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgTWlrZSBLaW5nIChAbWljamFta2luZylcclxuICpcclxuICogalF1ZXJ5IFN1Y2NpbmN0IHBsdWdpblxyXG4gKiBWZXJzaW9uIDEuMS4wIChPY3RvYmVyIDIwMTQpXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbiAvKmdsb2JhbCBqUXVlcnkqL1xyXG4oZnVuY3Rpb24oJCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0JC5mbi5zdWNjaW5jdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7XHJcblx0XHRcdFx0c2l6ZTogMjQwLFxyXG5cdFx0XHRcdG9taXNzaW9uOiAnLi4uJyxcclxuXHRcdFx0XHRpZ25vcmU6IHRydWVcclxuXHRcdFx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciB0ZXh0RGVmYXVsdCxcclxuXHRcdFx0XHR0ZXh0VHJ1bmNhdGVkLFxyXG5cdFx0XHRcdGVsZW1lbnRzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRyZWdleCAgICA9IC9bIS1cXC86LUBcXFstYHstfl0kLyxcclxuXHRcdFx0XHRpbml0ICAgICA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dGV4dERlZmF1bHQgPSAkKHRoaXMpLmh0bWwoKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0RGVmYXVsdC5sZW5ndGggPiBzZXR0aW5ncy5zaXplKSB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dFRydW5jYXRlZCA9ICQudHJpbSh0ZXh0RGVmYXVsdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgc2V0dGluZ3Muc2l6ZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zcGxpdCgnICcpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuc2xpY2UoMCwgLTEpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoc2V0dGluZ3MuaWdub3JlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0ZXh0VHJ1bmNhdGVkID0gdGV4dFRydW5jYXRlZC5yZXBsYWNlKHJlZ2V4LCAnJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmh0bWwodGV4dFRydW5jYXRlZCArIHNldHRpbmdzLm9taXNzaW9uKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0aW5pdCgpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxufSkoalF1ZXJ5KTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNDT01NT05cclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQ29tbW9uIG1ldGhvZHMgbW9kdWxlXHJcbiAqL1xyXG5lbXB0eWVwaS5tb2R1bGVzLmNvbW1vbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHViID0ge307XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFkZSBhd2F5IGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1Yi5oaWRlQ29udGVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgJChlbGVtZW50KS5hbmltYXRlKHtcclxuICAgICAgICAgICAgb3BhY2l0eTogXCIwXCJcclxuICAgICAgICB9LCAzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zbGlkZVVwKDMwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBFeHBvc2UgdGhlIHB1YmxpYyBtZXRob2RzXHJcbiAgICByZXR1cm4gcHViO1xyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI0NPT0tJRVNcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQ29va2llIGhhbmRsaW5nIG1vZHVsZVxyXG4gKi9cclxuZW1wdHllcGkubW9kdWxlcy5jb29raWVzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwdWIgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY29va2llXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSBjb29raWUsIG9yIG51bGwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1Yi5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgIHZhciBuYW1lRXEgPSBuYW1lICsgXCI9XCI7XHJcbiAgICAgICAgdmFyIHN0b3JlZENvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZENvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHN0b3JlZENvb2tpZXNbaV07XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY29va2llLmNoYXJBdCgwKSA9PT0gXCIgXCIpXHJcbiAgICAgICAgICAgICAgICBjb29raWUgPSBjb29raWUuc3Vic3RyaW5nKDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvb2tpZS5pbmRleE9mKG5hbWVFcSkgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb2tpZS5zdWJzdHJpbmcobmFtZUVxLmxlbmd0aCwgY29va2llLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNvb2tpZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGV4cGlyYXRpb25EYXlzXHJcbiAgICAgKi9cclxuICAgIHB1Yi5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGV4cGlyYXRpb25EYXlzKSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcmF0aW9uRGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTsgIC8vIHtkYXlzfSAqIDI0aCAqIDYwbWluICogNjBzZWMgKiAxMDAwbXNcclxuICAgICAgICB2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiOyBleHBpcmVzPVwiICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgbWV0aG9kc1xyXG4gICAgcmV0dXJuIHB1YjtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjU0VTU0lPTi1TVE9SQUdFXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3RhdGljL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmVtcHR5ZXBpID0gd2luZG93LmVtcHR5ZXBpIHx8IHt9O1xyXG5lbXB0eWVwaS5tb2R1bGVzID0gZW1wdHllcGkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFNlc3Npb24gc3RvcmFnZSBtb2R1bGVcclxuICovXHJcbmVtcHR5ZXBpLm1vZHVsZXMuc2Vzc2lvblN0b3JhZ2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHB1YiA9IHt9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBzZXNzaW9uIHN0b3JhZ2UgaXRlbVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgc2Vzc2lvbiBzdG9yYWdlIGl0ZW0sIG9yIG51bGwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1Yi5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKG5hbWUpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgc2Vzc2lvbiBzdG9yYWdlIGl0ZW1cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhbGVydElkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHViLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0obmFtZSwgdmFsdWUpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBtZXRob2RzXHJcbiAgICByZXR1cm4gcHViO1xyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI0JST1dTRVItV0lEVEhcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQnJvd3NlciB3aWR0aFxyXG4gKi9cclxuZW1wdHllcGkubW9kdWxlcy5icm93c2VyV2lkdGggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHB1YiA9IHt9O1xyXG4gICAgdmFyIGJyb3dzZXJXaWR0aDtcclxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IDE4O1xyXG4gICAgdmFyIGJyZWFrcG9pbnQgPSB7XHJcbiAgICAgICAgdGFibGV0U3RhcnQ6IDc2OCxcclxuICAgICAgICBkZXNrdG9wU3RhcnQ6IDEwMjRcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIG1vYmlsZSBicmVha3BvaW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHViLmlzTW9iaWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJyb3dzZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIHJldHVybiBicm93c2VyV2lkdGggPCBicmVha3BvaW50LnRhYmxldFN0YXJ0IC0gc2Nyb2xsYmFyV2lkdGg7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiB0YWJsZXQgYnJlYWtwb2ludFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHB1Yi5pc1RhYmxldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBicm93c2VyV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICByZXR1cm4gKGJyb3dzZXJXaWR0aCA+PSBicmVha3BvaW50LnRhYmxldFN0YXJ0IC0gc2Nyb2xsYmFyV2lkdGgpICYmIChicm93c2VyV2lkdGggPCBicmVha3BvaW50LmRlc2t0b3BTdGFydCAtIHNjcm9sbGJhcldpZHRoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGRlc2t0b3AgYnJlYWtwb2ludFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHB1Yi5pc0Rlc2t0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgcmV0dXJuIGJyb3dzZXJXaWR0aCA+PSBicmVha3BvaW50LmRlc2t0b3BTdGFydCAtIHNjcm9sbGJhcldpZHRoO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBtZXRob2RzXHJcbiAgICByZXR1cm4gcHViO1xyXG5cclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNQT0xZRklMTFNcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogUG9seWZpbGxzIG1vZHVsZVxyXG4gKi9cclxuZW1wdHllcGkubW9kdWxlcy5wb2x5ZmlsbHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjQ09MTEFQU0VcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQ29sbGFwc2UgbW9kdWxlXHJcbiAqL1xyXG5lbXB0eWVwaS5tb2R1bGVzLmNvbGxhcHNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcml2ID0ge307XHJcbiAgICB2YXIgYnJvd3NlcldpZHRoO1xyXG4gICAgdmFyIHJlc2l6ZVRpbWVyO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByaXZhdGUgaW5pdGlhbGl6YXRpb24gbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIHByaXYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBicm93c2VyV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHJcbiAgICAgICAgcHJpdi5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgcHJpdi5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHNcclxuICAgICAqL1xyXG4gICAgcHJpdi5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaW5kb3cgcmVzaXplXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcclxuICAgICAgICAgICAgcmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByaXYucmVzaXplKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbGljayBvbiBjb2xsYXBzZSBjb250cm9sXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChcIi5qcy1jb2xsYXBzZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgY29udHJvbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgIHZhciBpc0Rpc2FibGVkID0gcHJpdi5pc0Rpc2FibGVkKGNvbnRyb2wpO1xyXG4gICAgICAgICAgICB2YXIgaXNFeHBhbmRlZCA9IHByaXYuaXNFeHBhbmRlZChjb250cm9sKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGNvbGxhcHNlIGlzIGRpc2FibGVkIC0gdXNlIGRlZmF1bHQgbGluayBiZWhhdmlvdXJcclxuICAgICAgICAgICAgaWYgKGlzRGlzYWJsZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBjb2xsYXBzZSBpcyBub3QgZGlzYWJsZWQgLSBwcmV2ZW50IGRlZmF1bHQgbGluayBiZWhhdmlvdXIgYW5kIHVzZSBjb2xsYXBzZSBmdW5jdGlvblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgICBwcml2LmhpZGUoY29udHJvbCwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcHJpdi5zaG93KGNvbnRyb2wsIHRhcmdldCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbGljayBvbiBjb2xsYXBzZSBjbG9zZSBidXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICAkKFwiLmpzLWNvbGxhcHNlLWNsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKFwidGFyZ2V0XCIpO1xyXG4gICAgICAgICAgICAvLyBGaW5kIGFsbCBjb250cm9scyBmb3IgY29sbGFwc2UgdGFyZ2V0IChjb3VsZCBiZSBtdWx0aXBsZSlcclxuICAgICAgICAgICAgdmFyIGNvbnRyb2xzID0gJChcIi5qcy1jb2xsYXBzZVtkYXRhLXRhcmdldD0nXCIgKyB0YXJnZXQgKyBcIidcIik7XHJcblxyXG4gICAgICAgICAgICBjb250cm9scy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByaXYuaGlkZSh0aGlzLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZSBicm93c2VyXHJcbiAgICAgKi9cclxuICAgIHByaXYucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc0luRWRpdE1vZGUgPSAkKFwiaHRtbFwiKS5oYXNDbGFzcyhcImVkaXQtbW9kZVwiKTtcclxuICAgICAgICB2YXIgbmV3QnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhhc1Jlc2l6ZWRIb3Jpem9udGFsbHkgPSBuZXdCcm93c2VyV2lkdGggIT09IGJyb3dzZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiBicm93c2VyIHdpZHRoIGhhc24ndCBjaGFuZ2VkXHJcbiAgICAgICAgaWYgKCFoYXNSZXNpemVkSG9yaXpvbnRhbGx5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIElmIHdpZHRoIGhhcyBjaGFuZ2VkLCB1cGRhdGUgZ2xvYmFsIHZhcmlhYmxlXHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gbmV3QnJvd3NlcldpZHRoO1xyXG5cclxuICAgICAgICAvLyBJZiBOT1QgaW4gRVBpU2VydmVyIGVkaXQgbW9kZSwgcmVmcmVzaCBhbGwgY29sbGFwc2VzIG9uIHdpbmRvdyByZXNpemVcclxuICAgICAgICBpZiAoIWlzSW5FZGl0TW9kZSlcclxuICAgICAgICAgICAgcHJpdi5yZWZyZXNoKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZnJlc2ggYWxsIGNvbGxhcHNlc1xyXG4gICAgICovXHJcbiAgICBwcml2LnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtcyA9IGxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBwYXJhbWV0ZXJzIHdhcyBwcm92aWRlZCBpbiBVUkxcclxuICAgICAgICBpZiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgIC8vIFNwbGl0IHBhcmFtc1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc3Vic3RyKDEpLnNwbGl0KFwiJlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgcGFyYW1zXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTcGxpdCBwYXJhbWV0ZXIgb24gZXF1YWwgc2lnbiB0byBleHRyYWN0IGJvdGggbmFtZSBhbmQgdmFsdWVcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UGFyYW0gPSBwYXJhbXNbaV0uc3BsaXQoXCI9XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHBhcmFtIG5hbWUgaXMgXCJpZFwiXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhcmFtWzBdID09PSBcImlkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZXhwYW5kZWQgY2xhc3MgdG8gY29ycmVzcG9uZGluZyBjb2xsYXBzZSBjb250cm9sXHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIGN1cnJlbnRQYXJhbVsxXSkuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgaGFzaCBpcyBwcm92aWRlZCBpbiBVUkxcclxuICAgICAgICBpZiAoaGFzaCkge1xyXG4gICAgICAgICAgICAvLyBBZGQgZXhwYW5kZWQgY2xhc3MgdG8gY29sbGFwc2UgdGFyZ2V0IChpZiBpdCBpcyBmb3VuZClcclxuICAgICAgICAgICAgJChoYXNoKS5hZGRDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9vcCB0aHJvdWdoIGFsbCBjb2xsYXBzZXMgYW5kIGV4cGFuZCB0aGUgb25lcyB0aGF0IHNob3VsZCBiZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoXCIuanMtY29sbGFwc2VcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250cm9sID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQoY29udHJvbCkuZGF0YShcInRhcmdldFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc0Rpc2FibGVkID0gcHJpdi5pc0Rpc2FibGVkKGNvbnRyb2wpO1xyXG4gICAgICAgICAgICB2YXIgaXNFeHBhbmRlZCA9IHByaXYuaXNFeHBhbmRlZCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgc2hvdWxkQmVFeHBhbmRlZCA9IHByaXYuaXNFeHBhbmRlZChjb250cm9sKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgoaXNEaXNhYmxlZCAmJiAhaXNFeHBhbmRlZCkgfHwgKHNob3VsZEJlRXhwYW5kZWQgJiYgIWlzRXhwYW5kZWQpKSB7XHJcbiAgICAgICAgICAgICAgICBwcml2LnNob3coY29udHJvbCwgdGFyZ2V0LCAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNEaXNhYmxlZCAmJiBpc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBwcml2LmhpZGUoY29udHJvbCwgdGFyZ2V0LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250cm9sIC0gQ29sbGFwc2UgY29udHJvbFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldCAtIENvbGxhcHNlIHRhcmdldFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj0zMDBdIC0gVGhlIGFuaW1hdGlvbiBkdXJhdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2LnNob3cgPSBmdW5jdGlvbiAoY29udHJvbCwgdGFyZ2V0LCBkdXJhdGlvbikge1xyXG4gICAgICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDMwMDtcclxuXHJcbiAgICAgICAgdmFyIGlzQWNjb3JkaW9uID0gJChjb250cm9sKS5jbG9zZXN0KFwiLmFjY29yZGlvblwiKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIHZhciBjb2xsYXBzZVNpYmxpbmcgPSAkKGNvbnRyb2wpLmRhdGEoXCJjb2xsYXBzZS1zaWJsaW5nXCIpO1xyXG4gICAgICAgIHZhciBmb2N1c0VsZW1lbnQgPSAkKGNvbnRyb2wpLmRhdGEoXCJmb2N1c1wiKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQWNjb3JkaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBhY2NvcmRpb24gPSAkKGNvbnRyb2wpLmNsb3Nlc3QoXCIuYWNjb3JkaW9uXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBhbGwgY29sbGFwc2UgY29udHJvbHMgaW5zaWRlIGFjY29yZGlvbiBhbmQgaGlkZSB0aGVtXHJcbiAgICAgICAgICAgICQoYWNjb3JkaW9uKS5maW5kKFwiLmNvbGxhcHNlX19jb250cm9sXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkQ29udHJvbCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRUYXJnZXQgPSAkKHRoaXMpLm5leHQoXCIuY29sbGFwc2VfX3RhcmdldFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwcml2LmhpZGUoY2hpbGRDb250cm9sLCBjaGlsZFRhcmdldCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hvdyB0aGUgY2xpY2tlZCBjb2xsYXBzZVxyXG4gICAgICAgICQodGFyZ2V0KS5zbGlkZURvd24oZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gU2V0IGFyaWEgdG8gZXhwYW5kZWRcclxuICAgICAgICAgICAgJChjb250cm9sKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgJCh0YXJnZXQpLmF0dHIoXCJhcmlhLWhpZGRlblwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgZm9jdXMgaWYgZGF0YSBhdHRyaWJ1dGUgaGFzIGJlZW4gc2V0XHJcbiAgICAgICAgICAgIGlmIChmb2N1c0VsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAkKGZvY3VzRWxlbWVudCkuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBleHBhbmRlZCBjbGFzcyB0byBlbGVtZW50c1xyXG4gICAgICAgICQoY29udHJvbCkuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICAkKHRhcmdldCkuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICAkKGNvbnRyb2wpLmZpbmQoXCIuY29sbGFwc2VfX2ljb25cIikuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgYSBjb2xsYXBzZSBzaWJsaW5nIGlzIHByZXNlbnQsIGFkZCBleHBhbmRlZCBjbGFzcyBmcm9tIHRoYXQgYWxzb1xyXG4gICAgICAgIGlmIChjb2xsYXBzZVNpYmxpbmcpIHtcclxuICAgICAgICAgICAgJChjb250cm9sKS5wcmV2KGNvbGxhcHNlU2libGluZykuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhpZGUgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRyb2wgLSBDb2xsYXBzZSBjb250cm9sXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0IC0gQ29sbGFwc2UgdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTMwMF0gLSBUaGUgYW5pbWF0aW9uIGR1cmF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXYuaGlkZSA9IGZ1bmN0aW9uIChjb250cm9sLCB0YXJnZXQsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgaWYgKGR1cmF0aW9uID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGR1cmF0aW9uID0gMzAwO1xyXG5cclxuICAgICAgICAkKHRhcmdldCkuc2xpZGVVcChkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBTZXQgYXJpYSB0byBjb2xsYXBzZWRcclxuICAgICAgICAgICAgJChjb250cm9sKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5hdHRyKFwiYXJpYS1oaWRkZW5cIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgZXhwYW5kZWQgY2xhc3MgZnJvbSBlbGVtZW50c1xyXG4gICAgICAgICAgICAkKGNvbnRyb2wpLnJlbW92ZUNsYXNzKFwiaXMtZXhwYW5kZWQgaXMtYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAkKHRhcmdldCkucmVtb3ZlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICAgICAgJChjb250cm9sKS5maW5kKFwiLmNvbGxhcHNlX19pY29uXCIpLnJlbW92ZUNsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29sbGFwc2VTaWJsaW5nID0gJChjb250cm9sKS5kYXRhKFwiY29sbGFwc2Utc2libGluZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGEgY29sbGFwc2Ugc2libGluZyBpcyBwcmVzZW50LCByZW1vdmUgZXhwYW5kZWQgY2xhc3MgZnJvbSB0aGF0IGFsc29cclxuICAgICAgICAgICAgaWYgKGNvbGxhcHNlU2libGluZykge1xyXG4gICAgICAgICAgICAgICAgJChjb250cm9sKS5wcmV2KGNvbGxhcHNlU2libGluZykucmVtb3ZlQ2xhc3MoXCJpcy1leHBhbmRlZCBpcy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgY29sbGFwc2UgaXMgZGlzYWJsZWQgZm9yIGEgY29sbGFwc2UgY29udHJvbFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRyb2wgLSBUaGUgY29sbGFwc2UgY29udHJvbFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHByaXYuaXNEaXNhYmxlZCA9IGZ1bmN0aW9uIChjb250cm9sKSB7XHJcbiAgICAgICAgLy8gV2UgdXNlIHRoZSBjc3MgYXR0cmlidXRlIGBjb250ZW50YCB0byBwYXNzIGluZm9ybWF0aW9uIHRvIGphdmFzY3JpcHRcclxuICAgICAgICAvLyBhbmQgdGVsbCB0aGUgY29sbGFwc2UgbW9kdWxlIHRoYXQgd2UgZG9uJ3Qgd2FudCBjb2xsYXBzZSBiZWhhdmlvdXIgb25cclxuICAgICAgICAvLyB0aGUgY3VycmVudCBjb250cm9sIGluIGEgY2VydGFpbiBicmVha3BvaW50LlxyXG4gICAgICAgIHJldHVybiAkKGNvbnRyb2wpLmNzcyhcImNvbnRlbnRcIikgPT09IFwiXFxcImRpc2FibGUtY29sbGFwc2VcXFwiXCI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgZXhwYW5kZWRlZFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBUaGUgZWxlbWVudFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHByaXYuaXNFeHBhbmRlZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuICQoZWxlbWVudCkuaGFzQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgcHJpdmF0ZSBtZXRob2RzXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmluaXQoKTtcclxuICAgIH0pO1xyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI0NPT0tJRS1BTEVSVFxyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1N0YXRpYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5lbXB0eWVwaSA9IHdpbmRvdy5lbXB0eWVwaSB8fCB7fTtcclxuZW1wdHllcGkubW9kdWxlcyA9IGVtcHR5ZXBpLm1vZHVsZXMgfHwge307XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBDb29raWUgYWxlcnQgbW9kdWxlXHJcbiAqL1xyXG5lbXB0eWVwaS5tb2R1bGVzLmNvb2tpZUFsZXJ0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcml2ID0ge307XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJpdmF0ZSBpbml0aWFsaXphdGlvbiBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcHJpdi5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIHByaXYudmVyaWZ5Q29va2llQWNjZXB0YW5jZSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBwcml2LmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5qcy1hY2NlcHQtY29va2llc1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZW1wdHllcGkubW9kdWxlcy5jb29raWVzLnNldChcImNvb2tpZXNBY2NlcHRlZFwiLCB0cnVlLCAzNjUpO1xyXG4gICAgICAgICAgICBwcml2LnZlcmlmeUNvb2tpZUFjY2VwdGFuY2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZ5IGNvb2tpZSBhY2NlcHRhbmNlXHJcbiAgICAgKi9cclxuICAgIHByaXYudmVyaWZ5Q29va2llQWNjZXB0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoZW1wdHllcGkubW9kdWxlcy5jb29raWVzLmdldChcImNvb2tpZXNBY2NlcHRlZFwiKSlcclxuICAgICAgICAgICAgcHJpdi5oaWRlQ29va2llSW5mb3JtYXRpb24oKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHByaXYuc2hvd0Nvb2tpZUluZm9ybWF0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhpZGUgY29va2llIGluZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXYuaGlkZUNvb2tpZUluZm9ybWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKFwiLmNvb2tpZS1pbmZvcm1hdGlvblwiKS5pcyhcIjp2aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgIGVtcHR5ZXBpLm1vZHVsZXMuY29tbW9uLmhpZGVDb250ZW50KFwiLmNvb2tpZS1pbmZvcm1hdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgY29va2llIGluZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXYuc2hvd0Nvb2tpZUluZm9ybWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIuY29va2llLWluZm9ybWF0aW9uXCIpLnNob3coKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgbW9kdWxlXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmluaXQoKTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNPV0wtQ0FST1VTRUxcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogT3dsIGNhcm91c2VsIG1vZHVsZVxyXG4gKi9cclxuZW1wdHllcGkubW9kdWxlcy5vd2xDYXJvdXNlbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHJpdiA9IHt9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByaXZhdGUgaW5pdGlhbGl6YXRpb24gbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIHByaXYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmJpbmRFdmVudHMoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHNcclxuICAgICAqL1xyXG4gICAgcHJpdi5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemUgYWxsIGNhcm91c2Vsc1xyXG4gICAgICAgICQoXCIub3dsLWNhcm91c2VsXCIpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2VGV4dDogW1xyXG4gICAgICAgICAgICAgICAgXCI8c3BhbiBhcmlhLWhpZGRlbj0ndHJ1ZSc+Jmx0Ozwvc3Bhbj48c3BhbiBjbGFzcz0nc3Itb25seSc+RsO2cmVnw6VlbmRlIGJpbGQ8L3NwYW4+XCIsXHJcbiAgICAgICAgICAgICAgICBcIjxzcGFuIGFyaWEtaGlkZGVuPSd0cnVlJz4mZ3Q7PC9zcGFuPjxzcGFuIGNsYXNzPSdzci1vbmx5Jz5Ow6RzdGEgYmlsZDwvc3Bhbj5cIlxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENhcm91c2VsIGZvY3VzXHJcbiAgICAgICAgJChcIi5vd2wtY2Fyb3VzZWxcIikub24oXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBjdXJzb3Iga2V5c1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcclxuICAgICAgICAgICAgICAgIC8vIGdvIGxlZnRcclxuICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcihcInByZXYub3dsLmNhcm91c2VsXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBnbyByaWdodFxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwibmV4dC5vd2wuY2Fyb3VzZWxcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBtb2R1bGVcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuaW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNQUklOVFxyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1N0YXRpYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5zZW9tID0gd2luZG93LnNlb20gfHwge307XHJcbnNlb20ubW9kdWxlcyA9IHNlb20ubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFByaW50IG1vZHVsZVxyXG4gKi9cclxuc2VvbS5tb2R1bGVzLnByaW50ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcml2ID0ge307XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJpdmF0ZSBpbml0aWFsaXphdGlvbiBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcHJpdi5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuYmluZEV2ZW50cygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBwcml2LmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5qcy1wcmludFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgd2luZG93LnByaW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjU0hPVy1NT1JFXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3RhdGljL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmVtcHR5ZXBpID0gd2luZG93LmVtcHR5ZXBpIHx8IHt9O1xyXG5lbXB0eWVwaS5tb2R1bGVzID0gZW1wdHllcGkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIE1vZHVsZSBmb3Igc2hvd2luZyBtb3JlIChoaWRkZW4pIGRhdGFcclxuICovXHJcbmVtcHR5ZXBpLm1vZHVsZXMuc2hvd01vcmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWxpemUgYWxsIGxvYWQgbW9yZSdzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChcIi5qcy1zaG93LW1vcmVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRJdGVtcyA9ICQodGhpcykuZGF0YShcInRhcmdldC1pdGVtc1wiKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zVmlzaWJsZSA9ICQodGFyZ2V0KS5kYXRhKFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zVG90YWwgPSAkKHRhcmdldCkuZmluZCh0YXJnZXRJdGVtcykubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIG1vcmUgaXRlbXMgdG8gc2hvd1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNWaXNpYmxlIDwgaXRlbXNUb3RhbCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgaXRlbXNcclxuICAgICAgICAgICAgICAgICQodGFyZ2V0KS5maW5kKHRhcmdldEl0ZW1zKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBpdGVtIHNob3VsZCBiZSBoaWRkZW5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gaXRlbXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJpcy12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaG93IHRyaWdnZXJcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJpcy12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgbG9hZGluZyBtb3JlIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKFwiLmpzLXNob3ctbW9yZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEl0ZW1zID0gJCh0aGlzKS5kYXRhKFwidGFyZ2V0LWl0ZW1zXCIpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXNUb3RhbCA9ICQodGFyZ2V0KS5maW5kKHRhcmdldEl0ZW1zKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBpdGVtc1Zpc2libGUgPSAkKHRhcmdldCkuZGF0YShcInZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RlcCA9ICQodGFyZ2V0KS5kYXRhKFwic3RlcFwiKTtcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgaXRlbXMgdmlzaWJsZSB3aXRoIHN0ZXAgbnVtYmVyXHJcbiAgICAgICAgICAgIGl0ZW1zVmlzaWJsZSA9IHBhcnNlSW50KGl0ZW1zVmlzaWJsZSkgKyBwYXJzZUludChzdGVwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgaXRlbXMgdGhhdCBhcmUgbm90IGFscmVhZHkgdmlzaWJsZVxyXG4gICAgICAgICAgICAkKHRhcmdldCkuZmluZCh0YXJnZXRJdGVtcykubm90KFwiLmlzLXZpc2libGVcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHdlIGhhdmUgc2hvd24gdGhlIG51bWJlciBvZiBuZXcgaXRlbXMgYXMgZGVmaW5lZCBpbiBgc3RlcGAsIHdlIGV4aXQgdGhlIGVhY2ggbG9vcFxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IHN0ZXApXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNob3cgaXRlbVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImlzLXZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29udGludWUgZWFjaCBsb29wXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIHZpc2libGUgY291bnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5kYXRhKFwidmlzaWJsZVwiLCBpdGVtc1Zpc2libGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdHJpZ2dlciBlbGVtZW50IHNob3VsZCBiZSBoaWRkZW5cclxuICAgICAgICAgICAgaWYgKGl0ZW1zVmlzaWJsZSA+PSBpdGVtc1RvdGFsKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaXMtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjVFJVTkNBVEVcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TdGF0aWMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuZW1wdHllcGkgPSB3aW5kb3cuZW1wdHllcGkgfHwge307XHJcbmVtcHR5ZXBpLm1vZHVsZXMgPSBlbXB0eWVwaS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogVHJ1bmNhdGUgdGV4dCBtb2R1bGVcclxuICovXHJcbmVtcHR5ZXBpLm1vZHVsZXMudHJ1bmNhdGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuICAgIHZhciByZXNpemVUaW1lcjtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgcHJpdi50cnVuY2F0ZSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBwcml2LmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdpbmRvdyByZXNpemVcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xyXG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcHJpdi5yZXNpemUoKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZSBicm93c2VyXHJcbiAgICAgKi9cclxuICAgIHByaXYucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIFJlLXRydW5jYXRlIG9uIHdpbmRvdyByZXNpemUuIFdpbGwgb25seSB0cnVuY2F0ZSB3aGVuIHdpbmRvdyBpcyByZXNpemVkIHNtYWxsZXIuXHJcbiAgICAgICAgcHJpdi50cnVuY2F0ZSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcnVuY2F0ZVxyXG4gICAgICovXHJcbiAgICBwcml2LnRydW5jYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAkKFwiLmpzLXRydW5jYXRlXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdHJ1bmNhdGUgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dFdpZHRoID0gdHJ1bmNhdGUud2lkdGgoKTtcclxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gdHJ1bmNhdGUuY3NzKFwiZm9udC1zaXplXCIpO1xyXG4gICAgICAgICAgICB2YXIgbGV0dGVyV2lkdGggPSBwYXJzZUludChmb250U2l6ZSwgMTApIC8gMS44O1xyXG4gICAgICAgICAgICB2YXIgcm93cyA9IHRydW5jYXRlLmRhdGEoXCJyb3dzXCIpO1xyXG4gICAgICAgICAgICB2YXIgdHJ1bmNhdGVTaXplID0gTWF0aC5mbG9vcigodGV4dFdpZHRoIC8gbGV0dGVyV2lkdGgpICogcm93cyk7XHJcbiAgICAgICAgICAgIHZhciB0cnVuY2F0ZUNvbnRlbnQgPSB0cnVuY2F0ZS5maW5kKFwiLmpzLXRydW5jYXRlLWNvbnRlbnRcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0cnVuY2F0ZSBlbGVtZW50IGhhdmUgY2hpbGQgZWxlbWVudCB0aGF0IHNob3VsZCBiZSB0cnVuY2F0ZWQgaW5zdGVhZFxyXG4gICAgICAgICAgICBpZiAodHJ1bmNhdGVDb250ZW50Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHRydW5jYXRlID0gdHJ1bmNhdGVDb250ZW50O1xyXG5cclxuICAgICAgICAgICAgdHJ1bmNhdGUuc3VjY2luY3Qoe1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogdHJ1bmNhdGVTaXplLFxyXG4gICAgICAgICAgICAgICAgb21pc3Npb246IFwiXFx1MjAyNlwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgbW9kdWxlXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmluaXQoKTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNSRVNQT05TSVZFLUJHLUlNQUdFXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3RhdGljL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmVtcHR5ZXBpID0gd2luZG93LmVtcHR5ZXBpIHx8IHt9O1xyXG5lbXB0eWVwaS5tb2R1bGVzID0gZW1wdHllcGkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFJlc3BvbnNpdmUgYmFja2dyb3VuZCBpbWFnZVxyXG4gKi9cclxuZW1wdHllcGkubW9kdWxlcy5yZXNwb25zaXZlQmdJbWFnZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHJpdiA9IHt9O1xyXG4gICAgdmFyIGJyb3dzZXJXaWR0aDtcclxuICAgIHZhciBjc3NCYWNrZ3JvdW5kSW1hZ2U7XHJcbiAgICB2YXIgcmVzaXplVGltZXI7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJpdmF0ZSBpbml0aWFsaXphdGlvbiBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcHJpdi5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJyb3dzZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuICAgICAgICBwcml2LmJpbmRFdmVudHMoKTtcclxuICAgICAgICBwcml2LnJlZnJlc2hCYWNrZ3JvdW5kSW1hZ2UoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBwcml2LmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdpbmRvdyByZXNpemVcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xyXG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBwcml2LnJlc2l6ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzaXplIGJyb3dzZXJcclxuICAgICAqL1xyXG4gICAgcHJpdi5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaXNJbkVkaXRNb2RlID0gJChcImh0bWxcIikuaGFzQ2xhc3MoXCJlZGl0LW1vZGVcIik7XHJcbiAgICAgICAgdmFyIG5ld0Jyb3dzZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoYXNSZXNpemVkSG9yaXpvbnRhbGx5ID0gbmV3QnJvd3NlcldpZHRoICE9PSBicm93c2VyV2lkdGg7XHJcblxyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgaWYgYnJvd3NlciB3aWR0aCBoYXNuJ3QgY2hhbmdlZFxyXG4gICAgICAgIGlmICghaGFzUmVzaXplZEhvcml6b250YWxseSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBJZiB3aWR0aCBoYXMgY2hhbmdlZCwgdXBkYXRlIGdsb2JhbCB2YXJpYWJsZVxyXG4gICAgICAgIGJyb3dzZXJXaWR0aCA9IG5ld0Jyb3dzZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gSWYgTk9UIGluIEVQaVNlcnZlciBlZGl0IG1vZGUsIGNoYW5nZSBiYWNrZ3JvdW5kIGltYWdlXHJcbiAgICAgICAgaWYgKCFpc0luRWRpdE1vZGUpXHJcbiAgICAgICAgICAgIHByaXYucmVmcmVzaEJhY2tncm91bmRJbWFnZSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIGJhY2tncm91bmQgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgcHJpdi5yZWZyZXNoQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMb29wIHRocm91Z2ggYWxsIGVsZW1lbnRzIHdpdGggcmVzcG9uc2l2ZSBiYWNrZ3JvdW5kIGltYWdlIGZ1bmN0aW9uYWxpdHlcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKFwiLmpzLXJlc3BvbnNpdmUtYmctaW1hZ2VcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgaW1hZ2UgVVJMcyBmb3IgYnJlYWtwb2ludHNcclxuICAgICAgICAgICAgdmFyIGJnTW9iaWxlID0gJCh0aGlzKS5kYXRhKFwiYmctbW9iaWxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYmdUYWJsZXQgPSAkKHRoaXMpLmRhdGEoXCJiZy10YWJsZXRcIik7XHJcbiAgICAgICAgICAgIHZhciBiZ0Rlc2t0b3AgPSAkKHRoaXMpLmRhdGEoXCJiZy1kZXNrdG9wXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGN1cnJlbnQgQ1NTIGJhY2tncm91bmQgaW1hZ2VcclxuICAgICAgICAgICAgY3NzQmFja2dyb3VuZEltYWdlID0gJCh0aGlzKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgd2hpY2ggYmFja2dyb3VuZCBpbWFnZSB0aGF0IHNob3VsZCBiZSB1c2VkXHJcbiAgICAgICAgICAgIGlmIChlbXB0eWVwaS5tb2R1bGVzLmJyb3dzZXJXaWR0aC5pc01vYmlsZSgpICYmIGJnTW9iaWxlICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdNb2JpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNb2JpbGVcclxuICAgICAgICAgICAgICAgIHByaXYuc2V0QmFja2dyb3VuZEltYWdlKHRoaXMsIGJnTW9iaWxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlbXB0eWVwaS5tb2R1bGVzLmJyb3dzZXJXaWR0aC5pc1RhYmxldCgpICYmIGJnVGFibGV0ICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdUYWJsZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUYWJsZXRcclxuICAgICAgICAgICAgICAgIHByaXYuc2V0QmFja2dyb3VuZEltYWdlKHRoaXMsIGJnVGFibGV0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIChlbXB0eWVwaS5tb2R1bGVzLmJyb3dzZXJXaWR0aC5pc0Rlc2t0b3AoKSAmJiBiZ0Rlc2t0b3AgIT09IHVuZGVmaW5lZCAmJiAhcHJpdi5pc0JhY2tncm91bmRJbWFnZVNldChiZ0Rlc2t0b3ApKSB8fFxyXG4gICAgICAgICAgICAgICAgKGVtcHR5ZXBpLm1vZHVsZXMuYnJvd3NlcldpZHRoLmlzTW9iaWxlKCkgJiYgYmdNb2JpbGUgPT09IHVuZGVmaW5lZCAmJiBiZ0Rlc2t0b3AgIT09IHVuZGVmaW5lZCAmJiAhcHJpdi5pc0JhY2tncm91bmRJbWFnZVNldChiZ0Rlc2t0b3ApKSB8fFxyXG4gICAgICAgICAgICAgICAgKGVtcHR5ZXBpLm1vZHVsZXMuYnJvd3NlcldpZHRoLmlzVGFibGV0KCkgJiYgYmdUYWJsZXQgPT09IHVuZGVmaW5lZCkgJiYgYmdEZXNrdG9wICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdEZXNrdG9wKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGVza3RvcFxyXG4gICAgICAgICAgICAgICAgcHJpdi5zZXRCYWNrZ3JvdW5kSW1hZ2UodGhpcywgYmdEZXNrdG9wKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBDU1MgZm9ybWF0dGVkIGJhY2tncm91bmQgaW1hZ2UgdXJsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmxcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHByaXYuZ2V0QmFja2dyb3VuZEltYWdlVXJsID0gZnVuY3Rpb24gKGltYWdlVXJsKSB7XHJcbiAgICAgICAgdmFyIGNzc1VybCA9IFwidXJsKFwiICsgaW1hZ2VVcmwgKyBcIilcIjtcclxuICAgICAgICByZXR1cm4gY3NzVXJsO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgQ1NTIGJhY2tncm91bmQgaW1hZ2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZVVybFxyXG4gICAgICovXHJcbiAgICBwcml2LnNldEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBpbWFnZVVybCkge1xyXG4gICAgICAgICQoZWxlbWVudCkuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCBwcml2LmdldEJhY2tncm91bmRJbWFnZVVybChpbWFnZVVybCkpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHNldFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHJpdi5pc0JhY2tncm91bmRJbWFnZVNldCA9IGZ1bmN0aW9uIChpbWFnZVVybCkge1xyXG4gICAgICAgIHJldHVybiBjc3NCYWNrZ3JvdW5kSW1hZ2UuaW5kZXhPZihpbWFnZVVybCkgIT09IC0xO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBwcml2YXRlIG1ldGhvZHNcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuaW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
