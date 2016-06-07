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
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Common methods module
 */
borgeby.modules.common = (function () {
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

/*------------------------------------*\
    #POLYFILLS
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Polyfills module
 */
borgeby.modules.polyfills = (function () {
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

/*------------------------------------*\
    #PRINT
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Print module
 */
borgeby.modules.print = (function () {
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
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Module for showing more (hidden) data
 */
borgeby.modules.showMore = (function () {
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
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Truncate text module
 */
borgeby.modules.truncate = (function () {
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
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Responsive background image
 */
borgeby.modules.responsiveBgImage = (function () {
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
            if (borgeby.modules.browserWidth.isMobile() && bgMobile !== undefined && !priv.isBackgroundImageSet(bgMobile)) {
                // Mobile
                priv.setBackgroundImage(this, bgMobile);
            } else if (borgeby.modules.browserWidth.isTablet() && bgTablet !== undefined && !priv.isBackgroundImageSet(bgTablet)) {
                // Tablet
                priv.setBackgroundImage(this, bgTablet);
            } else if (
                (borgeby.modules.browserWidth.isDesktop() && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) ||
                (borgeby.modules.browserWidth.isMobile() && bgMobile === undefined && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) ||
                (borgeby.modules.browserWidth.isTablet() && bgTablet === undefined) && bgDesktop !== undefined && !priv.isBackgroundImageSet(bgDesktop)) {
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

/*------------------------------------*\
    #DIALOG
\*------------------------------------*/


// References for intellisense
/// <reference path="/Src/scripts/_references.js" />



// Namespace
window.borgeby = window.borgeby || {};
borgeby.modules = borgeby.modules || {};



/**
 * Dialog module
 */
borgeby.modules.dialog = (function () {
    var priv = {};


    /**
     * Private initialization method
     */
    priv.init = function () {
        priv.bindEvents();
    }


    /**
     * Bind events
     */
    priv.bindEvents = function () {

        /**
         * Click on collapse control
         */
        $(".js-dialog").on("click", function (event) {
            var dialogId = $(this).data("dialog");
            var dialogEl = document.getElementById(dialogId);
            var dialog = new A11yDialog(dialogEl);

            // Prevent default link behaviour
            event.preventDefault();

            // Show dialog
            dialog.show();

        });

    };


    // Initialize private methods
    $(function () {
        priv.init();
    });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVybml6ci1jdXN0b20uanMiLCJqUXVlcnkuc3VjY2luY3QuanMiLCJjb21tb24uanMiLCJjb29raWVzLmpzIiwic2Vzc2lvbi1zdG9yYWdlLmpzIiwiYnJvd3Nlci13aWR0aC5qcyIsInBvbHlmaWxscy5qcyIsImNvbGxhcHNlLmpzIiwiY29va2llLWFsZXJ0LmpzIiwicHJpbnQuanMiLCJzaG93LW1vcmUuanMiLCJ0cnVuY2F0ZS5qcyIsInJlc3BvbnNpdmUtYmctaW1hZ2UuanMiLCJkaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4K0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBtb2Rlcm5penIgdjMuMy4xXHJcbiAqIEJ1aWxkIGh0dHA6Ly9tb2Rlcm5penIuY29tL2Rvd25sb2FkPy1jb29raWVzLXN2Zy1zdmdhc2ltZy1hZGR0ZXN0LWZuYmluZC1wcmludHNoaXYtdGVzdHByb3AtZG9udG1pblxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpXHJcbiAqICBGYXJ1ayBBdGVzXHJcbiAqICBQYXVsIElyaXNoXHJcbiAqICBBbGV4IFNleHRvblxyXG4gKiAgUnlhbiBTZWRkb25cclxuICogIFBhdHJpY2sgS2V0dG5lclxyXG4gKiAgU3R1IENveFxyXG4gKiAgUmljaGFyZCBIZXJyZXJhXHJcblxyXG4gKiBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIE1vZGVybml6ciB0ZXN0cyB3aGljaCBuYXRpdmUgQ1NTMyBhbmQgSFRNTDUgZmVhdHVyZXMgYXJlIGF2YWlsYWJsZSBpbiB0aGVcclxuICogY3VycmVudCBVQSBhbmQgbWFrZXMgdGhlIHJlc3VsdHMgYXZhaWxhYmxlIHRvIHlvdSBpbiB0d28gd2F5czogYXMgcHJvcGVydGllcyBvblxyXG4gKiBhIGdsb2JhbCBgTW9kZXJuaXpyYCBvYmplY3QsIGFuZCBhcyBjbGFzc2VzIG9uIHRoZSBgPGh0bWw+YCBlbGVtZW50LiBUaGlzXHJcbiAqIGluZm9ybWF0aW9uIGFsbG93cyB5b3UgdG8gcHJvZ3Jlc3NpdmVseSBlbmhhbmNlIHlvdXIgcGFnZXMgd2l0aCBhIGdyYW51bGFyIGxldmVsXHJcbiAqIG9mIGNvbnRyb2wgb3ZlciB0aGUgZXhwZXJpZW5jZS5cclxuKi9cclxuXHJcbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKXtcclxuICB2YXIgdGVzdHMgPSBbXTtcclxuICBcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBNb2Rlcm5penJQcm90byBpcyB0aGUgY29uc3RydWN0b3IgZm9yIE1vZGVybml6clxyXG4gICAqXHJcbiAgICogQGNsYXNzXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKi9cclxuXHJcbiAgdmFyIE1vZGVybml6clByb3RvID0ge1xyXG4gICAgLy8gVGhlIGN1cnJlbnQgdmVyc2lvbiwgZHVtbXlcclxuICAgIF92ZXJzaW9uOiAnMy4zLjEnLFxyXG5cclxuICAgIC8vIEFueSBzZXR0aW5ncyB0aGF0IGRvbid0IHdvcmsgYXMgc2VwYXJhdGUgbW9kdWxlc1xyXG4gICAgLy8gY2FuIGdvIGluIGhlcmUgYXMgY29uZmlndXJhdGlvbi5cclxuICAgIF9jb25maWc6IHtcclxuICAgICAgJ2NsYXNzUHJlZml4JzogJycsXHJcbiAgICAgICdlbmFibGVDbGFzc2VzJzogdHJ1ZSxcclxuICAgICAgJ2VuYWJsZUpTQ2xhc3MnOiB0cnVlLFxyXG4gICAgICAndXNlUHJlZml4ZXMnOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFF1ZXVlIG9mIHRlc3RzXHJcbiAgICBfcTogW10sXHJcblxyXG4gICAgLy8gU3R1YiB0aGVzZSBmb3IgcGVvcGxlIHdobyBhcmUgbGlzdGVuaW5nXHJcbiAgICBvbjogZnVuY3Rpb24odGVzdCwgY2IpIHtcclxuICAgICAgLy8gSSBkb24ndCByZWFsbHkgdGhpbmsgcGVvcGxlIHNob3VsZCBkbyB0aGlzLCBidXQgd2UgY2FuXHJcbiAgICAgIC8vIHNhZmUgZ3VhcmQgaXQgYSBiaXQuXHJcbiAgICAgIC8vIC0tIE5PVEU6OiB0aGlzIGdldHMgV0FZIG92ZXJyaWRkZW4gaW4gc3JjL2FkZFRlc3QgZm9yIGFjdHVhbCBhc3luYyB0ZXN0cy5cclxuICAgICAgLy8gVGhpcyBpcyBpbiBjYXNlIHBlb3BsZSBsaXN0ZW4gdG8gc3luY2hyb25vdXMgdGVzdHMuIEkgd291bGQgbGVhdmUgaXQgb3V0LFxyXG4gICAgICAvLyBidXQgdGhlIGNvZGUgdG8gKmRpc2FsbG93KiBzeW5jIHRlc3RzIGluIHRoZSByZWFsIHZlcnNpb24gb2YgdGhpc1xyXG4gICAgICAvLyBmdW5jdGlvbiBpcyBhY3R1YWxseSBsYXJnZXIgdGhhbiB0aGlzLlxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY2Ioc2VsZlt0ZXN0XSk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRUZXN0OiBmdW5jdGlvbihuYW1lLCBmbiwgb3B0aW9ucykge1xyXG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lOiBuYW1lLCBmbjogZm4sIG9wdGlvbnM6IG9wdGlvbnN9KTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQXN5bmNUZXN0OiBmdW5jdGlvbihmbikge1xyXG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lOiBudWxsLCBmbjogZm59KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBcclxuXHJcbiAgLy8gRmFrZSBzb21lIG9mIE9iamVjdC5jcmVhdGUgc28gd2UgY2FuIGZvcmNlIG5vbiB0ZXN0IHJlc3VsdHMgdG8gYmUgbm9uIFwib3duXCIgcHJvcGVydGllcy5cclxuICB2YXIgTW9kZXJuaXpyID0gZnVuY3Rpb24oKSB7fTtcclxuICBNb2Rlcm5penIucHJvdG90eXBlID0gTW9kZXJuaXpyUHJvdG87XHJcblxyXG4gIC8vIExlYWsgbW9kZXJuaXpyIGdsb2JhbGx5IHdoZW4geW91IGByZXF1aXJlYCBpdCByYXRoZXIgdGhhbiBmb3JjZSBpdCBoZXJlLlxyXG4gIC8vIE92ZXJ3cml0ZSBuYW1lIHNvIGNvbnN0cnVjdG9yIG5hbWUgaXMgbmljZXIgOkRcclxuICBNb2Rlcm5penIgPSBuZXcgTW9kZXJuaXpyKCk7XHJcblxyXG4gIFxyXG5cclxuICB2YXIgY2xhc3NlcyA9IFtdO1xyXG4gIFxyXG5cclxuICAvKipcclxuICAgKiBpcyByZXR1cm5zIGEgYm9vbGVhbiBpZiB0aGUgdHlwZW9mIGFuIG9iaiBpcyBleGFjdGx5IHR5cGUuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gaXNcclxuICAgKiBAcGFyYW0geyp9IG9iaiAtIEEgdGhpbmcgd2Ugd2FudCB0byBjaGVjayB0aGUgdHlwZSBvZlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgdG8gY29tcGFyZSB0aGUgdHlwZW9mIGFnYWluc3RcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaXMob2JqLCB0eXBlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gdHlwZTtcclxuICB9XHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBSdW4gdGhyb3VnaCBhbGwgdGVzdHMgYW5kIGRldGVjdCB0aGVpciBzdXBwb3J0IGluIHRoZSBjdXJyZW50IFVBLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIHRlc3RSdW5uZXIoKSB7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWVzO1xyXG4gICAgdmFyIGZlYXR1cmU7XHJcbiAgICB2YXIgYWxpYXNJZHg7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgdmFyIG5hbWVJZHg7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWU7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWVTcGxpdDtcclxuXHJcbiAgICBmb3IgKHZhciBmZWF0dXJlSWR4IGluIHRlc3RzKSB7XHJcbiAgICAgIGlmICh0ZXN0cy5oYXNPd25Qcm9wZXJ0eShmZWF0dXJlSWR4KSkge1xyXG4gICAgICAgIGZlYXR1cmVOYW1lcyA9IFtdO1xyXG4gICAgICAgIGZlYXR1cmUgPSB0ZXN0c1tmZWF0dXJlSWR4XTtcclxuICAgICAgICAvLyBydW4gdGhlIHRlc3QsIHRocm93IHRoZSByZXR1cm4gdmFsdWUgaW50byB0aGUgTW9kZXJuaXpyLFxyXG4gICAgICAgIC8vIHRoZW4gYmFzZWQgb24gdGhhdCBib29sZWFuLCBkZWZpbmUgYW4gYXBwcm9wcmlhdGUgY2xhc3NOYW1lXHJcbiAgICAgICAgLy8gYW5kIHB1c2ggaXQgaW50byBhbiBhcnJheSBvZiBjbGFzc2VzIHdlJ2xsIGpvaW4gbGF0ZXIuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBuYW1lLCBpdCdzIGFuICdhc3luYycgdGVzdCB0aGF0IGlzIHJ1bixcclxuICAgICAgICAvLyBidXQgbm90IGRpcmVjdGx5IGFkZGVkIHRvIHRoZSBvYmplY3QuIFRoYXQgc2hvdWxkXHJcbiAgICAgICAgLy8gYmUgZG9uZSB3aXRoIGEgcG9zdC1ydW4gYWRkVGVzdCBjYWxsLlxyXG4gICAgICAgIGlmIChmZWF0dXJlLm5hbWUpIHtcclxuICAgICAgICAgIGZlYXR1cmVOYW1lcy5wdXNoKGZlYXR1cmUubmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAoZmVhdHVyZS5vcHRpb25zICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBBZGQgYWxsIHRoZSBhbGlhc2VzIGludG8gdGhlIG5hbWVzIGxpc3RcclxuICAgICAgICAgICAgZm9yIChhbGlhc0lkeCA9IDA7IGFsaWFzSWR4IDwgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoOyBhbGlhc0lkeCsrKSB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZU5hbWVzLnB1c2goZmVhdHVyZS5vcHRpb25zLmFsaWFzZXNbYWxpYXNJZHhdLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSdW4gdGhlIHRlc3QsIG9yIHVzZSB0aGUgcmF3IHZhbHVlIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb25cclxuICAgICAgICByZXN1bHQgPSBpcyhmZWF0dXJlLmZuLCAnZnVuY3Rpb24nKSA/IGZlYXR1cmUuZm4oKSA6IGZlYXR1cmUuZm47XHJcblxyXG5cclxuICAgICAgICAvLyBTZXQgZWFjaCBvZiB0aGUgbmFtZXMgb24gdGhlIE1vZGVybml6ciBvYmplY3RcclxuICAgICAgICBmb3IgKG5hbWVJZHggPSAwOyBuYW1lSWR4IDwgZmVhdHVyZU5hbWVzLmxlbmd0aDsgbmFtZUlkeCsrKSB7XHJcbiAgICAgICAgICBmZWF0dXJlTmFtZSA9IGZlYXR1cmVOYW1lc1tuYW1lSWR4XTtcclxuICAgICAgICAgIC8vIFN1cHBvcnQgZG90IHByb3BlcnRpZXMgYXMgc3ViIHRlc3RzLiBXZSBkb24ndCBkbyBjaGVja2luZyB0byBtYWtlIHN1cmVcclxuICAgICAgICAgIC8vIHRoYXQgdGhlIGltcGxpZWQgcGFyZW50IHRlc3RzIGhhdmUgYmVlbiBhZGRlZC4gWW91IG11c3QgY2FsbCB0aGVtIGluXHJcbiAgICAgICAgICAvLyBvcmRlciAoZWl0aGVyIGluIHRoZSB0ZXN0LCBvciBtYWtlIHRoZSBwYXJlbnQgdGVzdCBhIGRlcGVuZGVuY3kpLlxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIC8vIENhcCBpdCB0byBUV08gdG8gbWFrZSB0aGUgbG9naWMgc2ltcGxlIGFuZCBiZWNhdXNlIHdobyBuZWVkcyB0aGF0IGtpbmQgb2Ygc3VidGVzdGluZ1xyXG4gICAgICAgICAgLy8gaGFzaHRhZyBmYW1vdXMgbGFzdCB3b3Jkc1xyXG4gICAgICAgICAgZmVhdHVyZU5hbWVTcGxpdCA9IGZlYXR1cmVOYW1lLnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICAgICAgaWYgKGZlYXR1cmVOYW1lU3BsaXQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IHJlc3VsdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNhc3QgdG8gYSBCb29sZWFuLCBpZiBub3Qgb25lIGFscmVhZHlcclxuICAgICAgICAgICAgLyoganNoaW50IC1XMDUzICovXHJcbiAgICAgICAgICAgIGlmIChNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gJiYgIShNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gaW5zdGFuY2VvZiBCb29sZWFuKSkge1xyXG4gICAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IG5ldyBCb29sZWFuKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXVtmZWF0dXJlTmFtZVNwbGl0WzFdXSA9IHJlc3VsdDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjbGFzc2VzLnB1c2goKHJlc3VsdCA/ICcnIDogJ25vLScpICsgZmVhdHVyZU5hbWVTcGxpdC5qb2luKCctJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGhhc093blByb3AgaXMgYSBzaGltIGZvciBoYXNPd25Qcm9wZXJ0eSB0aGF0IGlzIG5lZWRlZCBmb3IgU2FmYXJpIDIuMCBzdXBwb3J0XHJcbiAgICpcclxuICAgKiBAYXV0aG9yIGthbmdheFxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBoYXNPd25Qcm9wXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCAtIFRoZSBvYmplY3QgdG8gY2hlY2sgZm9yIGEgcHJvcGVydHlcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSBUaGUgcHJvcGVydHkgdG8gY2hlY2sgZm9yXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcblxyXG4gIC8vIGhhc093blByb3BlcnR5IHNoaW0gYnkga2FuZ2F4IG5lZWRlZCBmb3IgU2FmYXJpIDIuMCBzdXBwb3J0XHJcbiAgdmFyIGhhc093blByb3A7XHJcblxyXG4gIChmdW5jdGlvbigpIHtcclxuICAgIHZhciBfaGFzT3duUHJvcGVydHkgPSAoe30pLmhhc093blByb3BlcnR5O1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIC8qIHdlIGhhdmUgbm8gd2F5IG9mIHRlc3RpbmcgSUUgNS41IG9yIHNhZmFyaSAyLFxyXG4gICAgICogc28ganVzdCBhc3N1bWUgdGhlIGVsc2UgZ2V0cyBoaXQgKi9cclxuICAgIGlmICghaXMoX2hhc093blByb3BlcnR5LCAndW5kZWZpbmVkJykgJiYgIWlzKF9oYXNPd25Qcm9wZXJ0eS5jYWxsLCAndW5kZWZpbmVkJykpIHtcclxuICAgICAgaGFzT3duUHJvcCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcclxuICAgICAgICByZXR1cm4gX2hhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaGFzT3duUHJvcCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgLyogeWVzLCB0aGlzIGNhbiBnaXZlIGZhbHNlIHBvc2l0aXZlcy9uZWdhdGl2ZXMsIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhvc2UgKi9cclxuICAgICAgICByZXR1cm4gKChwcm9wZXJ0eSBpbiBvYmplY3QpICYmIGlzKG9iamVjdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbcHJvcGVydHldLCAndW5kZWZpbmVkJykpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIFxyXG5cclxuICAvKipcclxuICAgKiBkb2NFbGVtZW50IGlzIGEgY29udmVuaWVuY2Ugd3JhcHBlciB0byBncmFiIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGRvY3VtZW50XHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gVGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgZG9jdW1lbnRcclxuICAgKi9cclxuXHJcbiAgdmFyIGRvY0VsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICAqIEEgY29udmVuaWVuY2UgaGVscGVyIHRvIGNoZWNrIGlmIHRoZSBkb2N1bWVudCB3ZSBhcmUgcnVubmluZyBpbiBpcyBhbiBTVkcgZG9jdW1lbnRcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICB2YXIgaXNTVkcgPSBkb2NFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnO1xyXG4gIFxyXG5cclxuICAvKipcclxuICAgKiBzZXRDbGFzc2VzIHRha2VzIGFuIGFycmF5IG9mIGNsYXNzIG5hbWVzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIHNldENsYXNzZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBjbGFzc2VzIC0gQXJyYXkgb2YgY2xhc3MgbmFtZXNcclxuICAgKi9cclxuXHJcbiAgLy8gUGFzcyBpbiBhbiBhbmQgYXJyYXkgb2YgY2xhc3MgbmFtZXMsIGUuZy46XHJcbiAgLy8gIFsnbm8td2VicCcsICdib3JkZXJyYWRpdXMnLCAuLi5dXHJcbiAgZnVuY3Rpb24gc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XHJcbiAgICB2YXIgY2xhc3NOYW1lID0gZG9jRWxlbWVudC5jbGFzc05hbWU7XHJcbiAgICB2YXIgY2xhc3NQcmVmaXggPSBNb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeCB8fCAnJztcclxuXHJcbiAgICBpZiAoaXNTVkcpIHtcclxuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLmJhc2VWYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hhbmdlIGBuby1qc2AgdG8gYGpzYCAoaW5kZXBlbmRlbnRseSBvZiB0aGUgYGVuYWJsZUNsYXNzZXNgIG9wdGlvbilcclxuICAgIC8vIEhhbmRsZSBjbGFzc1ByZWZpeCBvbiB0aGlzIHRvb1xyXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3MpIHtcclxuICAgICAgdmFyIHJlSlMgPSBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NQcmVmaXggKyAnbm8tanMoXFxcXHN8JCknKTtcclxuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UocmVKUywgJyQxJyArIGNsYXNzUHJlZml4ICsgJ2pzJDInKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3Nlcykge1xyXG4gICAgICAvLyBBZGQgdGhlIG5ldyBjbGFzc2VzXHJcbiAgICAgIGNsYXNzTmFtZSArPSAnICcgKyBjbGFzc1ByZWZpeCArIGNsYXNzZXMuam9pbignICcgKyBjbGFzc1ByZWZpeCk7XHJcbiAgICAgIGlzU1ZHID8gZG9jRWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCA9IGNsYXNzTmFtZSA6IGRvY0VsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIDtcclxuXHJcblxyXG4gICAvLyBfbCB0cmFja3MgbGlzdGVuZXJzIGZvciBhc3luYyB0ZXN0cywgYXMgd2VsbCBhcyB0ZXN0cyB0aGF0IGV4ZWN1dGUgYWZ0ZXIgdGhlIGluaXRpYWwgcnVuXHJcbiAgTW9kZXJuaXpyUHJvdG8uX2wgPSB7fTtcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kZXJuaXpyLm9uIGlzIGEgd2F5IHRvIGxpc3RlbiBmb3IgdGhlIGNvbXBsZXRpb24gb2YgYXN5bmMgdGVzdHMuIEJlaW5nXHJcbiAgICogYXN5bmNocm9ub3VzLCB0aGV5IG1heSBub3QgZmluaXNoIGJlZm9yZSB5b3VyIHNjcmlwdHMgcnVuLiBBcyBhIHJlc3VsdCB5b3VcclxuICAgKiB3aWxsIGdldCBhIHBvc3NpYmx5IGZhbHNlIG5lZ2F0aXZlIGB1bmRlZmluZWRgIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci5vblxyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICogQGZ1bmN0aW9uIG9uXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmUgLSBTdHJpbmcgbmFtZSBvZiB0aGUgZmVhdHVyZSBkZXRlY3RcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIHJldHVybmluZyBhIEJvb2xlYW4gLSB0cnVlIGlmIGZlYXR1cmUgaXMgc3VwcG9ydGVkLCBmYWxzZSBpZiBub3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBNb2Rlcm5penIub24oJ2ZsYXNoJywgZnVuY3Rpb24oIHJlc3VsdCApIHtcclxuICAgKiAgIGlmIChyZXN1bHQpIHtcclxuICAgKiAgICAvLyB0aGUgYnJvd3NlciBoYXMgZmxhc2hcclxuICAgKiAgIH0gZWxzZSB7XHJcbiAgICogICAgIC8vIHRoZSBicm93c2VyIGRvZXMgbm90IGhhdmUgZmxhc2hcclxuICAgKiAgIH1cclxuICAgKiB9KTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuXHJcbiAgTW9kZXJuaXpyUHJvdG8ub24gPSBmdW5jdGlvbihmZWF0dXJlLCBjYikge1xyXG4gICAgLy8gQ3JlYXRlIHRoZSBsaXN0IG9mIGxpc3RlbmVycyBpZiBpdCBkb2Vzbid0IGV4aXN0XHJcbiAgICBpZiAoIXRoaXMuX2xbZmVhdHVyZV0pIHtcclxuICAgICAgdGhpcy5fbFtmZWF0dXJlXSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFB1c2ggdGhpcyB0ZXN0IG9uIHRvIHRoZSBsaXN0ZW5lciBsaXN0XHJcbiAgICB0aGlzLl9sW2ZlYXR1cmVdLnB1c2goY2IpO1xyXG5cclxuICAgIC8vIElmIGl0J3MgYWxyZWFkeSBiZWVuIHJlc29sdmVkLCB0cmlnZ2VyIGl0IG9uIG5leHQgdGlja1xyXG4gICAgaWYgKE1vZGVybml6ci5oYXNPd25Qcm9wZXJ0eShmZWF0dXJlKSkge1xyXG4gICAgICAvLyBOZXh0IFRpY2tcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2Rlcm5penIuX3RyaWdnZXIoZmVhdHVyZSwgTW9kZXJuaXpyW2ZlYXR1cmVdKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogX3RyaWdnZXIgaXMgdGhlIHByaXZhdGUgZnVuY3Rpb24gdXNlZCB0byBzaWduYWwgdGVzdCBjb21wbGV0aW9uIGFuZCBydW4gYW55XHJcbiAgICogY2FsbGJhY2tzIHJlZ2lzdGVyZWQgdGhyb3VnaCBbTW9kZXJuaXpyLm9uXSgjbW9kZXJuaXpyLW9uKVxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fdHJpZ2dlclxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBfdHJpZ2dlclxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmZWF0dXJlIC0gc3RyaW5nIG5hbWUgb2YgdGhlIGZlYXR1cmUgZGV0ZWN0XHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFufSBbcmVzXSAtIEEgZmVhdHVyZSBkZXRlY3Rpb24gZnVuY3Rpb24sIG9yIHRoZSBib29sZWFuID1cclxuICAgKiByZXN1bHQgb2YgYSBmZWF0dXJlIGRldGVjdGlvbiBmdW5jdGlvblxyXG4gICAqL1xyXG5cclxuICBNb2Rlcm5penJQcm90by5fdHJpZ2dlciA9IGZ1bmN0aW9uKGZlYXR1cmUsIHJlcykge1xyXG4gICAgaWYgKCF0aGlzLl9sW2ZlYXR1cmVdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2JzID0gdGhpcy5fbFtmZWF0dXJlXTtcclxuXHJcbiAgICAvLyBGb3JjZSBhc3luY1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGksIGNiO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2IgPSBjYnNbaV07XHJcbiAgICAgICAgY2IocmVzKTtcclxuICAgICAgfVxyXG4gICAgfSwgMCk7XHJcblxyXG4gICAgLy8gRG9uJ3QgdHJpZ2dlciB0aGVzZSBhZ2FpblxyXG4gICAgZGVsZXRlIHRoaXMuX2xbZmVhdHVyZV07XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogYWRkVGVzdCBhbGxvd3MgeW91IHRvIGRlZmluZSB5b3VyIG93biBmZWF0dXJlIGRldGVjdHMgdGhhdCBhcmUgbm90IGN1cnJlbnRseVxyXG4gICAqIGluY2x1ZGVkIGluIE1vZGVybml6ciAodW5kZXIgdGhlIGNvdmVycyBpdCdzIHRoZSBleGFjdCBzYW1lIGNvZGUgTW9kZXJuaXpyXHJcbiAgICogdXNlcyBmb3IgaXRzIG93biBbZmVhdHVyZSBkZXRlY3Rpb25zXShodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci90cmVlL21hc3Rlci9mZWF0dXJlLWRldGVjdHMpKS4gSnVzdCBsaWtlIHRoZSBvZmZpY2FsIGRldGVjdHMsIHRoZSByZXN1bHRcclxuICAgKiB3aWxsIGJlIGFkZGVkIG9udG8gdGhlIE1vZGVybml6ciBvYmplY3QsIGFzIHdlbGwgYXMgYW4gYXBwcm9wcmlhdGUgY2xhc3NOYW1lIHNldCBvblxyXG4gICAqIHRoZSBodG1sIGVsZW1lbnQgd2hlbiBjb25maWd1cmVkIHRvIGRvIHNvXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLmFkZFRlc3RcclxuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIuYWRkVGVzdCgpXHJcbiAgICogQG9wdGlvblByb3AgYWRkVGVzdFxyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICogQGZ1bmN0aW9uIGFkZFRlc3RcclxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGZlYXR1cmUgLSBUaGUgc3RyaW5nIG5hbWUgb2YgdGhlIGZlYXR1cmUgZGV0ZWN0LCBvciBhblxyXG4gICAqIG9iamVjdCBvZiBmZWF0dXJlIGRldGVjdCBuYW1lcyBhbmQgdGVzdFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbn0gdGVzdCAtIEZ1bmN0aW9uIHJldHVybmluZyB0cnVlIGlmIGZlYXR1cmUgaXMgc3VwcG9ydGVkLFxyXG4gICAqIGZhbHNlIGlmIG5vdC4gT3RoZXJ3aXNlIGEgYm9vbGVhbiByZXByZXNlbnRpbmcgdGhlIHJlc3VsdHMgb2YgYSBmZWF0dXJlIGRldGVjdGlvblxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBUaGUgbW9zdCBjb21tb24gd2F5IG9mIGNyZWF0aW5nIHlvdXIgb3duIGZlYXR1cmUgZGV0ZWN0cyBpcyBieSBjYWxsaW5nXHJcbiAgICogYE1vZGVybml6ci5hZGRUZXN0YCB3aXRoIGEgc3RyaW5nIChwcmVmZXJhYmx5IGp1c3QgbG93ZXJjYXNlLCB3aXRob3V0IGFueVxyXG4gICAqIHB1bmN0dWF0aW9uKSwgYW5kIGEgZnVuY3Rpb24geW91IHdhbnQgZXhlY3V0ZWQgdGhhdCB3aWxsIHJldHVybiBhIGJvb2xlYW4gcmVzdWx0XHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci5hZGRUZXN0KCdpdHNUdWVzZGF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICogIHZhciBkID0gbmV3IERhdGUoKTtcclxuICAgKiAgcmV0dXJuIGQuZ2V0RGF5KCkgPT09IDI7XHJcbiAgICogfSk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBXaGVuIHRoZSBhYm92ZSBpcyBydW4sIGl0IHdpbGwgc2V0IE1vZGVybml6ci5pdHN0dWVzZGF5IHRvIGB0cnVlYCB3aGVuIGl0IGlzIHR1ZXNkYXksXHJcbiAgICogYW5kIHRvIGBmYWxzZWAgZXZlcnkgb3RoZXIgZGF5IG9mIHRoZSB3ZWVrLiBPbmUgdGhpbmcgdG8gbm90aWNlIGlzIHRoYXQgdGhlIG5hbWVzIG9mXHJcbiAgICogZmVhdHVyZSBkZXRlY3QgZnVuY3Rpb25zIGFyZSBhbHdheXMgbG93ZXJjYXNlZCB3aGVuIGFkZGVkIHRvIHRoZSBNb2Rlcm5penIgb2JqZWN0LiBUaGF0XHJcbiAgICogbWVhbnMgdGhhdCBgTW9kZXJuaXpyLml0c1R1ZXNkYXlgIHdpbGwgbm90IGV4aXN0LCBidXQgYE1vZGVybml6ci5pdHN0dWVzZGF5YCB3aWxsLlxyXG4gICAqXHJcbiAgICpcclxuICAgKiAgU2luY2Ugd2Ugb25seSBsb29rIGF0IHRoZSByZXR1cm5lZCB2YWx1ZSBmcm9tIGFueSBmZWF0dXJlIGRldGVjdGlvbiBmdW5jdGlvbixcclxuICAgKiAgeW91IGRvIG5vdCBuZWVkIHRvIGFjdHVhbGx5IHVzZSBhIGZ1bmN0aW9uLiBGb3Igc2ltcGxlIGRldGVjdGlvbnMsIGp1c3QgcGFzc2luZ1xyXG4gICAqICBpbiBhIHN0YXRlbWVudCB0aGF0IHdpbGwgcmV0dXJuIGEgYm9vbGVhbiB2YWx1ZSB3b3JrcyBqdXN0IGZpbmUuXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci5hZGRUZXN0KCdoYXNKcXVlcnknLCAnalF1ZXJ5JyBpbiB3aW5kb3cpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogSnVzdCBsaWtlIGJlZm9yZSwgd2hlbiB0aGUgYWJvdmUgcnVucyBgTW9kZXJuaXpyLmhhc2pxdWVyeWAgd2lsbCBiZSB0cnVlIGlmXHJcbiAgICogalF1ZXJ5IGhhcyBiZWVuIGluY2x1ZGVkIG9uIHRoZSBwYWdlLiBOb3QgdXNpbmcgYSBmdW5jdGlvbiBzYXZlcyBhIHNtYWxsIGFtb3VudFxyXG4gICAqIG9mIG92ZXJoZWFkIGZvciB0aGUgYnJvd3NlciwgYXMgd2VsbCBhcyBtYWtpbmcgeW91ciBjb2RlIG11Y2ggbW9yZSByZWFkYWJsZS5cclxuICAgKlxyXG4gICAqIEZpbmFsbHksIHlvdSBhbHNvIGhhdmUgdGhlIGFiaWxpdHkgdG8gcGFzcyBpbiBhbiBvYmplY3Qgb2YgZmVhdHVyZSBuYW1lcyBhbmRcclxuICAgKiB0aGVpciB0ZXN0cy4gVGhpcyBpcyBoYW5keSBpZiB5b3Ugd2FudCB0byBhZGQgbXVsdGlwbGUgZGV0ZWN0aW9ucyBpbiBvbmUgZ28uXHJcbiAgICogVGhlIGtleXMgc2hvdWxkIGFsd2F5cyBiZSBhIHN0cmluZywgYW5kIHRoZSB2YWx1ZSBjYW4gYmUgZWl0aGVyIGEgYm9vbGVhbiBvclxyXG4gICAqIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGJvb2xlYW4uXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIHZhciBkZXRlY3RzID0ge1xyXG4gICAqICAnaGFzanF1ZXJ5JzogJ2pRdWVyeScgaW4gd2luZG93LFxyXG4gICAqICAnaXRzdHVlc2RheSc6IGZ1bmN0aW9uKCkge1xyXG4gICAqICAgIHZhciBkID0gbmV3IERhdGUoKTtcclxuICAgKiAgICByZXR1cm4gZC5nZXREYXkoKSA9PT0gMjtcclxuICAgKiAgfVxyXG4gICAqIH1cclxuICAgKlxyXG4gICAqIE1vZGVybml6ci5hZGRUZXN0KGRldGVjdHMpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogVGhlcmUgaXMgcmVhbGx5IG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgZmlyc3QgbWV0aG9kcyBhbmQgdGhpcyBvbmUsIGl0IGlzXHJcbiAgICoganVzdCBhIGNvbnZlbmllbmNlIHRvIGxldCB5b3Ugd3JpdGUgbW9yZSByZWFkYWJsZSBjb2RlLlxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRUZXN0KGZlYXR1cmUsIHRlc3QpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGZlYXR1cmUgPT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yICh2YXIga2V5IGluIGZlYXR1cmUpIHtcclxuICAgICAgICBpZiAoaGFzT3duUHJvcChmZWF0dXJlLCBrZXkpKSB7XHJcbiAgICAgICAgICBhZGRUZXN0KGtleSwgZmVhdHVyZVsga2V5IF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIHZhciBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZS5zcGxpdCgnLicpO1xyXG4gICAgICB2YXIgbGFzdCA9IE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXTtcclxuXHJcbiAgICAgIC8vIEFnYWluLCB3ZSBkb24ndCBjaGVjayBmb3IgcGFyZW50IHRlc3QgZXhpc3RlbmNlLiBHZXQgdGhhdCByaWdodCwgdGhvdWdoLlxyXG4gICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT0gMikge1xyXG4gICAgICAgIGxhc3QgPSBsYXN0W2ZlYXR1cmVOYW1lU3BsaXRbMV1dO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGxhc3QgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBxdWl0IGlmIHlvdSdyZSB0cnlpbmcgdG8gb3ZlcndyaXRlIGFuIGV4aXN0aW5nIHRlc3RcclxuICAgICAgICAvLyBpZiB3ZSB3ZXJlIHRvIGFsbG93IGl0LCB3ZSdkIGRvIHRoaXM6XHJcbiAgICAgICAgLy8gICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiXFxcXGIobm8tKT9cIiArIGZlYXR1cmUgKyBcIlxcXFxiXCIpO1xyXG4gICAgICAgIC8vICAgZG9jRWxlbWVudC5jbGFzc05hbWUgPSBkb2NFbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCByZSwgJycgKTtcclxuICAgICAgICAvLyBidXQsIG5vIHJseSwgc3R1ZmYgJ2VtLlxyXG4gICAgICAgIHJldHVybiBNb2Rlcm5penI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRlc3QgPSB0eXBlb2YgdGVzdCA9PSAnZnVuY3Rpb24nID8gdGVzdCgpIDogdGVzdDtcclxuXHJcbiAgICAgIC8vIFNldCB0aGUgdmFsdWUgKHRoaXMgaXMgdGhlIG1hZ2ljLCByaWdodCBoZXJlKS5cclxuICAgICAgaWYgKGZlYXR1cmVOYW1lU3BsaXQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gPSB0ZXN0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGNhc3QgdG8gYSBCb29sZWFuLCBpZiBub3Qgb25lIGFscmVhZHlcclxuICAgICAgICAvKiBqc2hpbnQgLVcwNTMgKi9cclxuICAgICAgICBpZiAoTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dICYmICEoTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dIGluc3RhbmNlb2YgQm9vbGVhbikpIHtcclxuICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IG5ldyBCb29sZWFuKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV1bZmVhdHVyZU5hbWVTcGxpdFsxXV0gPSB0ZXN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTZXQgYSBzaW5nbGUgY2xhc3MgKGVpdGhlciBgZmVhdHVyZWAgb3IgYG5vLWZlYXR1cmVgKVxyXG4gICAgICAvKiBqc2hpbnQgLVcwNDEgKi9cclxuICAgICAgc2V0Q2xhc3NlcyhbKCEhdGVzdCAmJiB0ZXN0ICE9IGZhbHNlID8gJycgOiAnbm8tJykgKyBmZWF0dXJlTmFtZVNwbGl0LmpvaW4oJy0nKV0pO1xyXG4gICAgICAvKiBqc2hpbnQgK1cwNDEgKi9cclxuXHJcbiAgICAgIC8vIFRyaWdnZXIgdGhlIGV2ZW50XHJcbiAgICAgIE1vZGVybml6ci5fdHJpZ2dlcihmZWF0dXJlLCB0ZXN0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTW9kZXJuaXpyOyAvLyBhbGxvdyBjaGFpbmluZy5cclxuICB9XHJcblxyXG4gIC8vIEFmdGVyIGFsbCB0aGUgdGVzdHMgYXJlIHJ1biwgYWRkIHNlbGYgdG8gdGhlIE1vZGVybml6ciBwcm90b3R5cGVcclxuICBNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpIHtcclxuICAgIE1vZGVybml6clByb3RvLmFkZFRlc3QgPSBhZGRUZXN0O1xyXG4gIH0pO1xyXG5cclxuICBcclxuXHJcblxyXG4vKipcclxuICAqIEBvcHRpb25OYW1lIGh0bWw1cHJpbnRzaGl2XHJcbiAgKiBAb3B0aW9uUHJvcCBodG1sNXByaW50c2hpdlxyXG4gICovXHJcblxyXG4gIC8vIFRha2UgdGhlIGh0bWw1IHZhcmlhYmxlIG91dCBvZiB0aGUgaHRtbDVzaGl2IHNjb3BlIHNvIHdlIGNhbiByZXR1cm4gaXQuXHJcbiAgdmFyIGh0bWw1O1xyXG4gIGlmICghaXNTVkcpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcmVzZXJ2ZSBIVE1MNSBTaGl2IDMuNy4zIHwgQGFmYXJrYXMgQGpkYWx0b24gQGpvbl9uZWFsIEByZW0gfCBNSVQvR1BMMiBMaWNlbnNlZFxyXG4gICAgICovXHJcbiAgICA7KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuICAgICAgLypqc2hpbnQgZXZpbDp0cnVlICovXHJcbiAgICAgIC8qKiB2ZXJzaW9uICovXHJcbiAgICAgIHZhciB2ZXJzaW9uID0gJzMuNy4zJztcclxuXHJcbiAgICAgIC8qKiBQcmVzZXQgb3B0aW9ucyAqL1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IHdpbmRvdy5odG1sNSB8fCB7fTtcclxuXHJcbiAgICAgIC8qKiBVc2VkIHRvIHNraXAgcHJvYmxlbSBlbGVtZW50cyAqL1xyXG4gICAgICB2YXIgcmVTa2lwID0gL148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2k7XHJcblxyXG4gICAgICAvKiogTm90IGFsbCBlbGVtZW50cyBjYW4gYmUgY2xvbmVkIGluIElFICoqL1xyXG4gICAgICB2YXIgc2F2ZUNsb25lcyA9IC9eKD86YXxifGNvZGV8ZGl2fGZpZWxkc2V0fGgxfGgyfGgzfGg0fGg1fGg2fGl8bGFiZWx8bGl8b2x8cHxxfHNwYW58c3Ryb25nfHN0eWxlfHRhYmxlfHRib2R5fHRkfHRofHRyfHVsKSQvaTtcclxuXHJcbiAgICAgIC8qKiBEZXRlY3Qgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyBkZWZhdWx0IGh0bWw1IHN0eWxlcyAqL1xyXG4gICAgICB2YXIgc3VwcG9ydHNIdG1sNVN0eWxlcztcclxuXHJcbiAgICAgIC8qKiBOYW1lIG9mIHRoZSBleHBhbmRvLCB0byB3b3JrIHdpdGggbXVsdGlwbGUgZG9jdW1lbnRzIG9yIHRvIHJlLXNoaXYgb25lIGRvY3VtZW50ICovXHJcbiAgICAgIHZhciBleHBhbmRvID0gJ19odG1sNXNoaXYnO1xyXG5cclxuICAgICAgLyoqIFRoZSBpZCBmb3IgdGhlIHRoZSBkb2N1bWVudHMgZXhwYW5kbyAqL1xyXG4gICAgICB2YXIgZXhwYW5JRCA9IDA7XHJcblxyXG4gICAgICAvKiogQ2FjaGVkIGRhdGEgZm9yIGVhY2ggZG9jdW1lbnQgKi9cclxuICAgICAgdmFyIGV4cGFuZG9EYXRhID0ge307XHJcblxyXG4gICAgICAvKiogRGV0ZWN0IHdoZXRoZXIgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdW5rbm93biBlbGVtZW50cyAqL1xyXG4gICAgICB2YXIgc3VwcG9ydHNVbmtub3duRWxlbWVudHM7XHJcblxyXG4gICAgICAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgYS5pbm5lckhUTUwgPSAnPHh5ej48L3h5ej4nO1xyXG4gICAgICAgICAgLy9pZiB0aGUgaGlkZGVuIHByb3BlcnR5IGlzIGltcGxlbWVudGVkIHdlIGNhbiBhc3N1bWUsIHRoYXQgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYmFzaWMgSFRNTDUgU3R5bGVzXHJcbiAgICAgICAgICBzdXBwb3J0c0h0bWw1U3R5bGVzID0gKCdoaWRkZW4nIGluIGEpO1xyXG5cclxuICAgICAgICAgIHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzID0gYS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxIHx8IChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gYXNzaWduIGEgZmFsc2UgcG9zaXRpdmUgaWYgdW5hYmxlIHRvIHNoaXZcclxuICAgICAgICAgICAgKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpKCdhJyk7XHJcbiAgICAgICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIHR5cGVvZiBmcmFnLmNsb25lTm9kZSA9PSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIGZyYWcuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCA9PSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIGZyYWcuY3JlYXRlRWxlbWVudCA9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSgpKTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgIC8vIGFzc2lnbiBhIGZhbHNlIHBvc2l0aXZlIGlmIGRldGVjdGlvbiBmYWlscyA9PiB1bmFibGUgdG8gc2hpdlxyXG4gICAgICAgICAgc3VwcG9ydHNIdG1sNVN0eWxlcyA9IHRydWU7XHJcbiAgICAgICAgICBzdXBwb3J0c1Vua25vd25FbGVtZW50cyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSgpKTtcclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIENyZWF0ZXMgYSBzdHlsZSBzaGVldCB3aXRoIHRoZSBnaXZlbiBDU1MgdGV4dCBhbmQgYWRkcyBpdCB0byB0aGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50LlxyXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY3NzVGV4dCBUaGUgQ1NTIHRleHQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtTdHlsZVNoZWV0fSBUaGUgc3R5bGUgZWxlbWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGFkZFN0eWxlU2hlZXQob3duZXJEb2N1bWVudCwgY3NzVGV4dCkge1xyXG4gICAgICAgIHZhciBwID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyksXHJcbiAgICAgICAgICBwYXJlbnQgPSBvd25lckRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0gfHwgb3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gJ3g8c3R5bGU+JyArIGNzc1RleHQgKyAnPC9zdHlsZT4nO1xyXG4gICAgICAgIHJldHVybiBwYXJlbnQuaW5zZXJ0QmVmb3JlKHAubGFzdENoaWxkLCBwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBgaHRtbDUuZWxlbWVudHNgIGFzIGFuIGFycmF5LlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEFuIGFycmF5IG9mIHNoaXZlZCBlbGVtZW50IG5vZGUgbmFtZXMuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSBodG1sNS5lbGVtZW50cztcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGVsZW1lbnRzID09ICdzdHJpbmcnID8gZWxlbWVudHMuc3BsaXQoJyAnKSA6IGVsZW1lbnRzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogRXh0ZW5kcyB0aGUgYnVpbHQtaW4gbGlzdCBvZiBodG1sNSBlbGVtZW50c1xyXG4gICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IG5ld0VsZW1lbnRzIHdoaXRlc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb3IgYXJyYXkgb2YgbmV3IGVsZW1lbnQgbmFtZXMgdG8gc2hpdlxyXG4gICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBjb250ZXh0IGRvY3VtZW50LlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYWRkRWxlbWVudHMobmV3RWxlbWVudHMsIG93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSBodG1sNS5lbGVtZW50cztcclxuICAgICAgICBpZih0eXBlb2YgZWxlbWVudHMgIT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50cy5qb2luKCcgJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBuZXdFbGVtZW50cyAhPSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICBuZXdFbGVtZW50cyA9IG5ld0VsZW1lbnRzLmpvaW4oJyAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbDUuZWxlbWVudHMgPSBlbGVtZW50cyArJyAnKyBuZXdFbGVtZW50cztcclxuICAgICAgICBzaGl2RG9jdW1lbnQob3duZXJEb2N1bWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGdpdmVuIGRvY3VtZW50XHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50LlxyXG4gICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3Qgb2YgZGF0YS5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGV4cGFuZG9EYXRhW293bmVyRG9jdW1lbnRbZXhwYW5kb11dO1xyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgZXhwYW5JRCsrO1xyXG4gICAgICAgICAgb3duZXJEb2N1bWVudFtleHBhbmRvXSA9IGV4cGFuSUQ7XHJcbiAgICAgICAgICBleHBhbmRvRGF0YVtleHBhbklEXSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogcmV0dXJucyBhIHNoaXZlZCBlbGVtZW50IGZvciB0aGUgZ2l2ZW4gbm9kZU5hbWUgYW5kIGRvY3VtZW50XHJcbiAgICAgICAqIEBtZW1iZXJPZiBodG1sNVxyXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbm9kZU5hbWUgbmFtZSBvZiB0aGUgZWxlbWVudFxyXG4gICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBjb250ZXh0IGRvY3VtZW50LlxyXG4gICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc2hpdmVkIGVsZW1lbnQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KG5vZGVOYW1lLCBvd25lckRvY3VtZW50LCBkYXRhKXtcclxuICAgICAgICBpZiAoIW93bmVyRG9jdW1lbnQpIHtcclxuICAgICAgICAgIG93bmVyRG9jdW1lbnQgPSBkb2N1bWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3VwcG9ydHNVbmtub3duRWxlbWVudHMpe1xyXG4gICAgICAgICAgcmV0dXJuIG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgZGF0YSA9IGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbm9kZTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuY2FjaGVbbm9kZU5hbWVdKSB7XHJcbiAgICAgICAgICBub2RlID0gZGF0YS5jYWNoZVtub2RlTmFtZV0uY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzYXZlQ2xvbmVzLnRlc3Qobm9kZU5hbWUpKSB7XHJcbiAgICAgICAgICBub2RlID0gKGRhdGEuY2FjaGVbbm9kZU5hbWVdID0gZGF0YS5jcmVhdGVFbGVtKG5vZGVOYW1lKSkuY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUgPSBkYXRhLmNyZWF0ZUVsZW0obm9kZU5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXZvaWQgYWRkaW5nIHNvbWUgZWxlbWVudHMgdG8gZnJhZ21lbnRzIGluIElFIDwgOSBiZWNhdXNlXHJcbiAgICAgICAgLy8gKiBBdHRyaWJ1dGVzIGxpa2UgYG5hbWVgIG9yIGB0eXBlYCBjYW5ub3QgYmUgc2V0L2NoYW5nZWQgb25jZSBhbiBlbGVtZW50XHJcbiAgICAgICAgLy8gICBpcyBpbnNlcnRlZCBpbnRvIGEgZG9jdW1lbnQvZnJhZ21lbnRcclxuICAgICAgICAvLyAqIExpbmsgZWxlbWVudHMgd2l0aCBgc3JjYCBhdHRyaWJ1dGVzIHRoYXQgYXJlIGluYWNjZXNzaWJsZSwgYXMgd2l0aFxyXG4gICAgICAgIC8vICAgYSA0MDMgcmVzcG9uc2UsIHdpbGwgY2F1c2UgdGhlIHRhYi93aW5kb3cgdG8gY3Jhc2hcclxuICAgICAgICAvLyAqIFNjcmlwdCBlbGVtZW50cyBhcHBlbmRlZCB0byBmcmFnbWVudHMgd2lsbCBleGVjdXRlIHdoZW4gdGhlaXIgYHNyY2BcclxuICAgICAgICAvLyAgIG9yIGB0ZXh0YCBwcm9wZXJ0eSBpcyBzZXRcclxuICAgICAgICByZXR1cm4gbm9kZS5jYW5IYXZlQ2hpbGRyZW4gJiYgIXJlU2tpcC50ZXN0KG5vZGVOYW1lKSAmJiAhbm9kZS50YWdVcm4gPyBkYXRhLmZyYWcuYXBwZW5kQ2hpbGQobm9kZSkgOiBub2RlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogcmV0dXJucyBhIHNoaXZlZCBEb2N1bWVudEZyYWdtZW50IGZvciB0aGUgZ2l2ZW4gZG9jdW1lbnRcclxuICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGNvbnRleHQgZG9jdW1lbnQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzaGl2ZWQgRG9jdW1lbnRGcmFnbWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQob3duZXJEb2N1bWVudCwgZGF0YSl7XHJcbiAgICAgICAgaWYgKCFvd25lckRvY3VtZW50KSB7XHJcbiAgICAgICAgICBvd25lckRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzKXtcclxuICAgICAgICAgIHJldHVybiBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwgZ2V0RXhwYW5kb0RhdGEob3duZXJEb2N1bWVudCk7XHJcbiAgICAgICAgdmFyIGNsb25lID0gZGF0YS5mcmFnLmNsb25lTm9kZSgpLFxyXG4gICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICBlbGVtcyA9IGdldEVsZW1lbnRzKCksXHJcbiAgICAgICAgICBsID0gZWxlbXMubGVuZ3RoO1xyXG4gICAgICAgIGZvcig7aTxsO2krKyl7XHJcbiAgICAgICAgICBjbG9uZS5jcmVhdGVFbGVtZW50KGVsZW1zW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogU2hpdnMgdGhlIGBjcmVhdGVFbGVtZW50YCBhbmQgYGNyZWF0ZURvY3VtZW50RnJhZ21lbnRgIG1ldGhvZHMgb2YgdGhlIGRvY3VtZW50LlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fERvY3VtZW50RnJhZ21lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50LlxyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBvZiB0aGUgZG9jdW1lbnQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaGl2TWV0aG9kcyhvd25lckRvY3VtZW50LCBkYXRhKSB7XHJcbiAgICAgICAgaWYgKCFkYXRhLmNhY2hlKSB7XHJcbiAgICAgICAgICBkYXRhLmNhY2hlID0ge307XHJcbiAgICAgICAgICBkYXRhLmNyZWF0ZUVsZW0gPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQ7XHJcbiAgICAgICAgICBkYXRhLmNyZWF0ZUZyYWcgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ7XHJcbiAgICAgICAgICBkYXRhLmZyYWcgPSBkYXRhLmNyZWF0ZUZyYWcoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihub2RlTmFtZSkge1xyXG4gICAgICAgICAgLy9hYm9ydCBzaGl2XHJcbiAgICAgICAgICBpZiAoIWh0bWw1LnNoaXZNZXRob2RzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNyZWF0ZUVsZW0obm9kZU5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQobm9kZU5hbWUsIG93bmVyRG9jdW1lbnQsIGRhdGEpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCA9IEZ1bmN0aW9uKCdoLGYnLCAncmV0dXJuIGZ1bmN0aW9uKCl7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhciBuPWYuY2xvbmVOb2RlKCksYz1uLmNyZWF0ZUVsZW1lbnQ7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2guc2hpdk1ldGhvZHMmJignICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1bnJvbGwgdGhlIGBjcmVhdGVFbGVtZW50YCBjYWxsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVsZW1lbnRzKCkuam9pbigpLnJlcGxhY2UoL1tcXHdcXC06XSsvZywgZnVuY3Rpb24obm9kZU5hbWUpIHtcclxuICAgICAgICAgIGRhdGEuY3JlYXRlRWxlbShub2RlTmFtZSk7XHJcbiAgICAgICAgICBkYXRhLmZyYWcuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XHJcbiAgICAgICAgICByZXR1cm4gJ2MoXCInICsgbm9kZU5hbWUgKyAnXCIpJztcclxuICAgICAgICB9KSArXHJcbiAgICAgICAgICAnKTtyZXR1cm4gbn0nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKGh0bWw1LCBkYXRhLmZyYWcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTaGl2cyB0aGUgZ2l2ZW4gZG9jdW1lbnQuXHJcbiAgICAgICAqIEBtZW1iZXJPZiBodG1sNVxyXG4gICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBkb2N1bWVudCB0byBzaGl2LlxyXG4gICAgICAgKiBAcmV0dXJucyB7RG9jdW1lbnR9IFRoZSBzaGl2ZWQgZG9jdW1lbnQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaGl2RG9jdW1lbnQob3duZXJEb2N1bWVudCkge1xyXG4gICAgICAgIGlmICghb3duZXJEb2N1bWVudCkge1xyXG4gICAgICAgICAgb3duZXJEb2N1bWVudCA9IGRvY3VtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGF0YSA9IGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpO1xyXG5cclxuICAgICAgICBpZiAoaHRtbDUuc2hpdkNTUyAmJiAhc3VwcG9ydHNIdG1sNVN0eWxlcyAmJiAhZGF0YS5oYXNDU1MpIHtcclxuICAgICAgICAgIGRhdGEuaGFzQ1NTID0gISFhZGRTdHlsZVNoZWV0KG93bmVyRG9jdW1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3JyZWN0cyBibG9jayBkaXNwbGF5IG5vdCBkZWZpbmVkIGluIElFNi83LzgvOVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja30nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRTYvNy84LzlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfScgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZXMgbm9uLXJlbmRlcmVkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGV7ZGlzcGxheTpub25lfSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdXBwb3J0c1Vua25vd25FbGVtZW50cykge1xyXG4gICAgICAgICAgc2hpdk1ldGhvZHMob3duZXJEb2N1bWVudCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvd25lckRvY3VtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgYGh0bWw1YCBvYmplY3QgaXMgZXhwb3NlZCBzbyB0aGF0IG1vcmUgZWxlbWVudHMgY2FuIGJlIHNoaXZlZCBhbmRcclxuICAgICAgICogZXhpc3Rpbmcgc2hpdmluZyBjYW4gYmUgZGV0ZWN0ZWQgb24gaWZyYW1lcy5cclxuICAgICAgICogQHR5cGUgT2JqZWN0XHJcbiAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAqXHJcbiAgICAgICAqIC8vIG9wdGlvbnMgY2FuIGJlIGNoYW5nZWQgYmVmb3JlIHRoZSBzY3JpcHQgaXMgaW5jbHVkZWRcclxuICAgICAgICogaHRtbDUgPSB7ICdlbGVtZW50cyc6ICdtYXJrIHNlY3Rpb24nLCAnc2hpdkNTUyc6IGZhbHNlLCAnc2hpdk1ldGhvZHMnOiBmYWxzZSB9O1xyXG4gICAgICAgKi9cclxuICAgICAgdmFyIGh0bWw1ID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBbiBhcnJheSBvciBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIG5vZGUgbmFtZXMgb2YgdGhlIGVsZW1lbnRzIHRvIHNoaXYuXHJcbiAgICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAgICogQHR5cGUgQXJyYXl8U3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ2VsZW1lbnRzJzogb3B0aW9ucy5lbGVtZW50cyB8fCAnYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGJkaSBjYW52YXMgZGF0YSBkYXRhbGlzdCBkZXRhaWxzIGRpYWxvZyBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgaGVhZGVyIGhncm91cCBtYWluIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwaWN0dXJlIHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvJyxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY3VycmVudCB2ZXJzaW9uIG9mIGh0bWw1c2hpdlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICd2ZXJzaW9uJzogdmVyc2lvbixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIEhUTUw1IHN0eWxlIHNoZWV0IHNob3VsZCBiZSBpbnNlcnRlZC5cclxuICAgICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICAgKiBAdHlwZSBCb29sZWFuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ3NoaXZDU1MnOiAob3B0aW9ucy5zaGl2Q1NTICE9PSBmYWxzZSksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElzIGVxdWFsIHRvIHRydWUgaWYgYSBicm93c2VyIHN1cHBvcnRzIGNyZWF0aW5nIHVua25vd24vSFRNTDUgZWxlbWVudHNcclxuICAgICAgICAgKiBAbWVtYmVyT2YgaHRtbDVcclxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ3N1cHBvcnRzVW5rbm93bkVsZW1lbnRzJzogc3VwcG9ydHNVbmtub3duRWxlbWVudHMsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoZSBkb2N1bWVudCdzIGBjcmVhdGVFbGVtZW50YCBhbmQgYGNyZWF0ZURvY3VtZW50RnJhZ21lbnRgXHJcbiAgICAgICAgICogbWV0aG9kcyBzaG91bGQgYmUgb3ZlcndyaXR0ZW4uXHJcbiAgICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAgICogQHR5cGUgQm9vbGVhblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICdzaGl2TWV0aG9kcyc6IChvcHRpb25zLnNoaXZNZXRob2RzICE9PSBmYWxzZSksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgc3RyaW5nIHRvIGRlc2NyaWJlIHRoZSB0eXBlIG9mIGBodG1sNWAgb2JqZWN0IChcImRlZmF1bHRcIiBvciBcImRlZmF1bHQgcHJpbnRcIikuXHJcbiAgICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAgICogQHR5cGUgU3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJ3R5cGUnOiAnZGVmYXVsdCcsXHJcblxyXG4gICAgICAgIC8vIHNoaXZzIHRoZSBkb2N1bWVudCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCBgaHRtbDVgIG9iamVjdCBvcHRpb25zXHJcbiAgICAgICAgJ3NoaXZEb2N1bWVudCc6IHNoaXZEb2N1bWVudCxcclxuXHJcbiAgICAgICAgLy9jcmVhdGVzIGEgc2hpdmVkIGVsZW1lbnRcclxuICAgICAgICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50LFxyXG5cclxuICAgICAgICAvL2NyZWF0ZXMgYSBzaGl2ZWQgZG9jdW1lbnRGcmFnbWVudFxyXG4gICAgICAgIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6IGNyZWF0ZURvY3VtZW50RnJhZ21lbnQsXHJcblxyXG4gICAgICAgIC8vZXh0ZW5kcyBsaXN0IG9mIGVsZW1lbnRzXHJcbiAgICAgICAgYWRkRWxlbWVudHM6IGFkZEVsZW1lbnRzXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8vIGV4cG9zZSBodG1sNVxyXG4gICAgICB3aW5kb3cuaHRtbDUgPSBodG1sNTtcclxuXHJcbiAgICAgIC8vIHNoaXYgdGhlIGRvY3VtZW50XHJcbiAgICAgIHNoaXZEb2N1bWVudChkb2N1bWVudCk7XHJcblxyXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUHJpbnQgU2hpdiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAgIC8qKiBVc2VkIHRvIGZpbHRlciBtZWRpYSB0eXBlcyAqL1xyXG4gICAgICB2YXIgcmVNZWRpYSA9IC9eJHxcXGIoPzphbGx8cHJpbnQpXFxiLztcclxuXHJcbiAgICAgIC8qKiBVc2VkIHRvIG5hbWVzcGFjZSBwcmludGFibGUgZWxlbWVudHMgKi9cclxuICAgICAgdmFyIHNoaXZOYW1lc3BhY2UgPSAnaHRtbDVzaGl2JztcclxuXHJcbiAgICAgIC8qKiBEZXRlY3Qgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyBzaGl2YWJsZSBzdHlsZSBzaGVldHMgKi9cclxuICAgICAgdmFyIHN1cHBvcnRzU2hpdmFibGVTaGVldHMgPSAhc3VwcG9ydHNVbmtub3duRWxlbWVudHMgJiYgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGFzc2lnbiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHVuYWJsZSB0byBzaGl2XHJcbiAgICAgICAgdmFyIGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIHJldHVybiAhKFxyXG4gICAgICAgICAgdHlwZW9mIGRvY3VtZW50Lm5hbWVzcGFjZXMgPT0gJ3VuZGVmaW5lZCcgfHxcclxuICAgICAgICAgICAgdHlwZW9mIGRvY3VtZW50LnBhcmVudFdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2YgZG9jRWwuYXBwbHlFbGVtZW50ID09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBkb2NFbC5yZW1vdmVOb2RlID09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiB3aW5kb3cuYXR0YWNoRXZlbnQgPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICApO1xyXG4gICAgICB9KCkpO1xyXG5cclxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogV3JhcHMgYWxsIEhUTUw1IGVsZW1lbnRzIGluIHRoZSBnaXZlbiBkb2N1bWVudCB3aXRoIHByaW50YWJsZSBlbGVtZW50cy5cclxuICAgICAgICogKGVnLiB0aGUgXCJoZWFkZXJcIiBlbGVtZW50IGlzIHdyYXBwZWQgd2l0aCB0aGUgXCJodG1sNXNoaXY6aGVhZGVyXCIgZWxlbWVudClcclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgd3JhcHBlcnMgYWRkZWQuXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBhZGRXcmFwcGVycyhvd25lckRvY3VtZW50KSB7XHJcbiAgICAgICAgdmFyIG5vZGUsXHJcbiAgICAgICAgbm9kZXMgPSBvd25lckRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCcqJyksXHJcbiAgICAgICAgICBpbmRleCA9IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgIHJlRWxlbWVudHMgPSBSZWdFeHAoJ14oPzonICsgZ2V0RWxlbWVudHMoKS5qb2luKCd8JykgKyAnKSQnLCAnaScpLFxyXG4gICAgICAgICAgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlIChpbmRleC0tKSB7XHJcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhdO1xyXG4gICAgICAgICAgaWYgKHJlRWxlbWVudHMudGVzdChub2RlLm5vZGVOYW1lKSkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlLmFwcGx5RWxlbWVudChjcmVhdGVXcmFwcGVyKG5vZGUpKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBDcmVhdGVzIGEgcHJpbnRhYmxlIHdyYXBwZXIgZm9yIHRoZSBnaXZlbiBlbGVtZW50LlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQuXHJcbiAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBUaGUgd3JhcHBlci5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIoZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBub2RlLFxyXG4gICAgICAgIG5vZGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgaW5kZXggPSBub2Rlcy5sZW5ndGgsXHJcbiAgICAgICAgICB3cmFwcGVyID0gZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc2hpdk5hbWVzcGFjZSArICc6JyArIGVsZW1lbnQubm9kZU5hbWUpO1xyXG5cclxuICAgICAgICAvLyBjb3B5IGVsZW1lbnQgYXR0cmlidXRlcyB0byB0aGUgd3JhcHBlclxyXG4gICAgICAgIHdoaWxlIChpbmRleC0tKSB7XHJcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhdO1xyXG4gICAgICAgICAgbm9kZS5zcGVjaWZpZWQgJiYgd3JhcHBlci5zZXRBdHRyaWJ1dGUobm9kZS5ub2RlTmFtZSwgbm9kZS5ub2RlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb3B5IGVsZW1lbnQgc3R5bGVzIHRvIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgd3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZWxlbWVudC5zdHlsZS5jc3NUZXh0O1xyXG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogU2hpdnMgdGhlIGdpdmVuIENTUyB0ZXh0LlxyXG4gICAgICAgKiAoZWcuIGhlYWRlcnt9IGJlY29tZXMgaHRtbDVzaGl2XFw6aGVhZGVye30pXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NUZXh0IFRoZSBDU1MgdGV4dCB0byBzaGl2LlxyXG4gICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc2hpdmVkIENTUyB0ZXh0LlxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2hpdkNzc1RleHQoY3NzVGV4dCkge1xyXG4gICAgICAgIHZhciBwYWlyLFxyXG4gICAgICAgIHBhcnRzID0gY3NzVGV4dC5zcGxpdCgneycpLFxyXG4gICAgICAgICAgaW5kZXggPSBwYXJ0cy5sZW5ndGgsXHJcbiAgICAgICAgICByZUVsZW1lbnRzID0gUmVnRXhwKCcoXnxbXFxcXHMsPit+XSkoJyArIGdldEVsZW1lbnRzKCkuam9pbignfCcpICsgJykoPz1bW1xcXFxzLD4rfiMuOl18JCknLCAnZ2knKSxcclxuICAgICAgICAgIHJlcGxhY2VtZW50ID0gJyQxJyArIHNoaXZOYW1lc3BhY2UgKyAnXFxcXDokMic7XHJcblxyXG4gICAgICAgIHdoaWxlIChpbmRleC0tKSB7XHJcbiAgICAgICAgICBwYWlyID0gcGFydHNbaW5kZXhdID0gcGFydHNbaW5kZXhdLnNwbGl0KCd9Jyk7XHJcbiAgICAgICAgICBwYWlyW3BhaXIubGVuZ3RoIC0gMV0gPSBwYWlyW3BhaXIubGVuZ3RoIC0gMV0ucmVwbGFjZShyZUVsZW1lbnRzLCByZXBsYWNlbWVudCk7XHJcbiAgICAgICAgICBwYXJ0c1tpbmRleF0gPSBwYWlyLmpvaW4oJ30nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJ3snKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHdyYXBwZXJzLCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBlbGVtZW50cy5cclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHBhcmFtcyB7QXJyYXl9IHdyYXBwZXJzIEFuIGFycmF5IG9mIHByaW50YWJsZSB3cmFwcGVycy5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHJlbW92ZVdyYXBwZXJzKHdyYXBwZXJzKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gd3JhcHBlcnMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpbmRleC0tKSB7XHJcbiAgICAgICAgICB3cmFwcGVyc1tpbmRleF0ucmVtb3ZlTm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogU2hpdnMgdGhlIGdpdmVuIGRvY3VtZW50IGZvciBwcmludC5cclxuICAgICAgICogQG1lbWJlck9mIGh0bWw1XHJcbiAgICAgICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50IHRvIHNoaXYuXHJcbiAgICAgICAqIEByZXR1cm5zIHtEb2N1bWVudH0gVGhlIHNoaXZlZCBkb2N1bWVudC5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHNoaXZQcmludChvd25lckRvY3VtZW50KSB7XHJcbiAgICAgICAgdmFyIHNoaXZlZFNoZWV0LFxyXG4gICAgICAgIHdyYXBwZXJzLFxyXG4gICAgICAgIGRhdGEgPSBnZXRFeHBhbmRvRGF0YShvd25lckRvY3VtZW50KSxcclxuICAgICAgICAgIG5hbWVzcGFjZXMgPSBvd25lckRvY3VtZW50Lm5hbWVzcGFjZXMsXHJcbiAgICAgICAgICBvd25lcldpbmRvdyA9IG93bmVyRG9jdW1lbnQucGFyZW50V2luZG93O1xyXG5cclxuICAgICAgICBpZiAoIXN1cHBvcnRzU2hpdmFibGVTaGVldHMgfHwgb3duZXJEb2N1bWVudC5wcmludFNoaXZlZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG93bmVyRG9jdW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlc1tzaGl2TmFtZXNwYWNlXSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbmFtZXNwYWNlcy5hZGQoc2hpdk5hbWVzcGFjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVTaGVldCgpIHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLl9yZW1vdmVTaGVldFRpbWVyKTtcclxuICAgICAgICAgIGlmIChzaGl2ZWRTaGVldCkge1xyXG4gICAgICAgICAgICBzaGl2ZWRTaGVldC5yZW1vdmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2hpdmVkU2hlZXQ9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvd25lcldpbmRvdy5hdHRhY2hFdmVudCgnb25iZWZvcmVwcmludCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgIHJlbW92ZVNoZWV0KCk7XHJcblxyXG4gICAgICAgICAgdmFyIGltcG9ydHMsXHJcbiAgICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgICBzaGVldCxcclxuICAgICAgICAgIGNvbGxlY3Rpb24gPSBvd25lckRvY3VtZW50LnN0eWxlU2hlZXRzLFxyXG4gICAgICAgICAgICBjc3NUZXh0ID0gW10sXHJcbiAgICAgICAgICAgIGluZGV4ID0gY29sbGVjdGlvbi5sZW5ndGgsXHJcbiAgICAgICAgICAgIHNoZWV0cyA9IEFycmF5KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAvLyBjb252ZXJ0IHN0eWxlU2hlZXRzIGNvbGxlY3Rpb24gdG8gYW4gYXJyYXlcclxuICAgICAgICAgIHdoaWxlIChpbmRleC0tKSB7XHJcbiAgICAgICAgICAgIHNoZWV0c1tpbmRleF0gPSBjb2xsZWN0aW9uW2luZGV4XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGNvbmNhdCBhbGwgc3R5bGUgc2hlZXQgQ1NTIHRleHRcclxuICAgICAgICAgIHdoaWxlICgoc2hlZXQgPSBzaGVldHMucG9wKCkpKSB7XHJcbiAgICAgICAgICAgIC8vIElFIGRvZXMgbm90IGVuZm9yY2UgYSBzYW1lIG9yaWdpbiBwb2xpY3kgZm9yIGV4dGVybmFsIHN0eWxlIHNoZWV0cy4uLlxyXG4gICAgICAgICAgICAvLyBidXQgaGFzIHRyb3VibGUgd2l0aCBzb21lIGR5bmFtaWNhbGx5IGNyZWF0ZWQgc3R5bGVzaGVldHNcclxuICAgICAgICAgICAgaWYgKCFzaGVldC5kaXNhYmxlZCAmJiByZU1lZGlhLnRlc3Qoc2hlZXQubWVkaWEpKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpbXBvcnRzID0gc2hlZXQuaW1wb3J0cztcclxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IGltcG9ydHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIH0gY2F0Y2goZXIpe1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgc2hlZXRzLnB1c2goaW1wb3J0c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNzc1RleHQucHVzaChzaGVldC5jc3NUZXh0KTtcclxuICAgICAgICAgICAgICB9IGNhdGNoKGVyKXt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyB3cmFwIGFsbCBIVE1MNSBlbGVtZW50cyB3aXRoIHByaW50YWJsZSBlbGVtZW50cyBhbmQgYWRkIHRoZSBzaGl2ZWQgc3R5bGUgc2hlZXRcclxuICAgICAgICAgIGNzc1RleHQgPSBzaGl2Q3NzVGV4dChjc3NUZXh0LnJldmVyc2UoKS5qb2luKCcnKSk7XHJcbiAgICAgICAgICB3cmFwcGVycyA9IGFkZFdyYXBwZXJzKG93bmVyRG9jdW1lbnQpO1xyXG4gICAgICAgICAgc2hpdmVkU2hlZXQgPSBhZGRTdHlsZVNoZWV0KG93bmVyRG9jdW1lbnQsIGNzc1RleHQpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3duZXJXaW5kb3cuYXR0YWNoRXZlbnQoJ29uYWZ0ZXJwcmludCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgLy8gcmVtb3ZlIHdyYXBwZXJzLCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBlbGVtZW50cywgYW5kIHJlbW92ZSB0aGUgc2hpdmVkIHN0eWxlIHNoZWV0XHJcbiAgICAgICAgICByZW1vdmVXcmFwcGVycyh3cmFwcGVycyk7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQoZGF0YS5fcmVtb3ZlU2hlZXRUaW1lcik7XHJcbiAgICAgICAgICBkYXRhLl9yZW1vdmVTaGVldFRpbWVyID0gc2V0VGltZW91dChyZW1vdmVTaGVldCwgNTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3duZXJEb2N1bWVudC5wcmludFNoaXZlZCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIG93bmVyRG9jdW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgICAgLy8gZXhwb3NlIEFQSVxyXG4gICAgICBodG1sNS50eXBlICs9ICcgcHJpbnQnO1xyXG4gICAgICBodG1sNS5zaGl2UHJpbnQgPSBzaGl2UHJpbnQ7XHJcblxyXG4gICAgICAvLyBzaGl2IGZvciBwcmludFxyXG4gICAgICBzaGl2UHJpbnQoZG9jdW1lbnQpO1xyXG5cclxuICAgICAgaWYodHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBodG1sNTtcclxuICAgICAgfVxyXG5cclxuICAgIH0odHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMsIGRvY3VtZW50KSk7XHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBjb250YWlucyBjaGVja3MgdG8gc2VlIGlmIGEgc3RyaW5nIGNvbnRhaW5zIGFub3RoZXIgc3RyaW5nXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gY29udGFpbnNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB3ZSB3YW50IHRvIGNoZWNrIGZvciBzdWJzdHJpbmdzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnN0ciAtIFRoZSBzdWJzdHJpbmcgd2Ugd2FudCB0byBzZWFyY2ggdGhlIGZpcnN0IHN0cmluZyBmb3JcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY29udGFpbnMoc3RyLCBzdWJzdHIpIHtcclxuICAgIHJldHVybiAhIX4oJycgKyBzdHIpLmluZGV4T2Yoc3Vic3RyKTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogY3JlYXRlRWxlbWVudCBpcyBhIGNvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuIFNpbmNlIHdlXHJcbiAgICogdXNlIGNyZWF0ZUVsZW1lbnQgYWxsIG92ZXIgdGhlIHBsYWNlLCB0aGlzIGFsbG93cyBmb3IgKHNsaWdodGx5KSBzbWFsbGVyIGNvZGVcclxuICAgKiBhcyB3ZWxsIGFzIGFic3RyYWN0aW5nIGF3YXkgaXNzdWVzIHdpdGggY3JlYXRpbmcgZWxlbWVudHMgaW4gY29udGV4dHMgb3RoZXIgdGhhblxyXG4gICAqIEhUTUwgZG9jdW1lbnRzIChlLmcuIFNWRyBkb2N1bWVudHMpLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRcclxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gQW4gSFRNTCBvciBTVkcgZWxlbWVudFxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNhc2UgaW4gSUU3LCB3aGVyZSB0aGUgdHlwZSBvZiBjcmVhdGVFbGVtZW50IGlzIFwib2JqZWN0XCIuXHJcbiAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiwgd2UgY2Fubm90IGNhbGwgYXBwbHkoKSBhcyBPYmplY3QgaXMgbm90IGEgRnVuY3Rpb24uXHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGFyZ3VtZW50c1swXSk7XHJcbiAgICB9IGVsc2UgaWYgKGlzU1ZHKSB7XHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMuY2FsbChkb2N1bWVudCwgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgYXJndW1lbnRzWzBdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50LmFwcGx5KGRvY3VtZW50LCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgb3VyIFwibW9kZXJuaXpyXCIgZWxlbWVudCB0aGF0IHdlIGRvIG1vc3QgZmVhdHVyZSB0ZXN0cyBvbi5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqL1xyXG5cclxuICB2YXIgbW9kRWxlbSA9IHtcclxuICAgIGVsZW06IGNyZWF0ZUVsZW1lbnQoJ21vZGVybml6cicpXHJcbiAgfTtcclxuXHJcbiAgLy8gQ2xlYW4gdXAgdGhpcyBlbGVtZW50XHJcbiAgTW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKSB7XHJcbiAgICBkZWxldGUgbW9kRWxlbS5lbGVtO1xyXG4gIH0pO1xyXG5cclxuICBcclxuXHJcbiAgdmFyIG1TdHlsZSA9IHtcclxuICAgIHN0eWxlOiBtb2RFbGVtLmVsZW0uc3R5bGVcclxuICB9O1xyXG5cclxuICAvLyBraWxsIHJlZiBmb3IgZ2MsIG11c3QgaGFwcGVuIGJlZm9yZSBtb2QuZWxlbSBpcyByZW1vdmVkLCBzbyB3ZSB1bnNoaWZ0IG9uIHRvXHJcbiAgLy8gdGhlIGZyb250IG9mIHRoZSBxdWV1ZS5cclxuICBNb2Rlcm5penIuX3EudW5zaGlmdChmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XHJcbiAgfSk7XHJcblxyXG4gIFxyXG5cclxuICAvKipcclxuICAgKiBnZXRCb2R5IHJldHVybnMgdGhlIGJvZHkgb2YgYSBkb2N1bWVudCwgb3IgYW4gZWxlbWVudCB0aGF0IGNhbiBzdGFuZCBpbiBmb3JcclxuICAgKiB0aGUgYm9keSBpZiBhIHJlYWwgYm9keSBkb2VzIG5vdCBleGlzdFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGdldEJvZHlcclxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gUmV0dXJucyB0aGUgcmVhbCBib2R5IG9mIGEgZG9jdW1lbnQsIG9yIGFuXHJcbiAgICogYXJ0aWZpY2lhbGx5IGNyZWF0ZWQgZWxlbWVudCB0aGF0IHN0YW5kcyBpbiBmb3IgdGhlIGJvZHlcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcclxuICAgIC8vIEFmdGVyIHBhZ2UgbG9hZCBpbmplY3RpbmcgYSBmYWtlIGJvZHkgZG9lc24ndCB3b3JrIHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXHJcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgaWYgKCFib2R5KSB7XHJcbiAgICAgIC8vIENhbid0IHVzZSB0aGUgcmVhbCBib2R5IGNyZWF0ZSBhIGZha2Ugb25lLlxyXG4gICAgICBib2R5ID0gY3JlYXRlRWxlbWVudChpc1NWRyA/ICdzdmcnIDogJ2JvZHknKTtcclxuICAgICAgYm9keS5mYWtlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm9keTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBpbmplY3RFbGVtZW50V2l0aFN0eWxlc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIC0gU3RyaW5nIHJlcHJlc2VudGluZyBhIGNzcyBydWxlXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byB0ZXN0IHRoZSBpbmplY3RlZCBlbGVtZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtub2Rlc10gLSBBbiBpbnRlZ2VyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIGFkZGl0aW9uYWwgbm9kZXMgeW91IHdhbnQgaW5qZWN0ZWRcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbdGVzdG5hbWVzXSAtIEFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBhcmUgdXNlZCBhcyBpZHMgZm9yIHRoZSBhZGRpdGlvbmFsIG5vZGVzXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKHJ1bGUsIGNhbGxiYWNrLCBub2RlcywgdGVzdG5hbWVzKSB7XHJcbiAgICB2YXIgbW9kID0gJ21vZGVybml6cic7XHJcbiAgICB2YXIgc3R5bGU7XHJcbiAgICB2YXIgcmV0O1xyXG4gICAgdmFyIG5vZGU7XHJcbiAgICB2YXIgZG9jT3ZlcmZsb3c7XHJcbiAgICB2YXIgZGl2ID0gY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2YXIgYm9keSA9IGdldEJvZHkoKTtcclxuXHJcbiAgICBpZiAocGFyc2VJbnQobm9kZXMsIDEwKSkge1xyXG4gICAgICAvLyBJbiBvcmRlciBub3QgdG8gZ2l2ZSBmYWxzZSBwb3NpdGl2ZXMgd2UgY3JlYXRlIGEgbm9kZSBmb3IgZWFjaCB0ZXN0XHJcbiAgICAgIC8vIFRoaXMgYWxzbyBhbGxvd3MgdGhlIG1ldGhvZCB0byBzY2FsZSBmb3IgdW5zcGVjaWZpZWQgdXNlc1xyXG4gICAgICB3aGlsZSAobm9kZXMtLSkge1xyXG4gICAgICAgIG5vZGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBub2RlLmlkID0gdGVzdG5hbWVzID8gdGVzdG5hbWVzW25vZGVzXSA6IG1vZCArIChub2RlcyArIDEpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0eWxlID0gY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xyXG4gICAgc3R5bGUuaWQgPSAncycgKyBtb2Q7XHJcblxyXG4gICAgLy8gSUU2IHdpbGwgZmFsc2UgcG9zaXRpdmUgb24gc29tZSB0ZXN0cyBkdWUgdG8gdGhlIHN0eWxlIGVsZW1lbnQgaW5zaWRlIHRoZSB0ZXN0IGRpdiBzb21laG93IGludGVyZmVyaW5nIG9mZnNldEhlaWdodCwgc28gaW5zZXJ0IGl0IGludG8gYm9keSBvciBmYWtlYm9keS5cclxuICAgIC8vIE9wZXJhIHdpbGwgYWN0IGFsbCBxdWlya3kgd2hlbiBpbmplY3RpbmcgZWxlbWVudHMgaW4gZG9jdW1lbnRFbGVtZW50IHdoZW4gcGFnZSBpcyBzZXJ2ZWQgYXMgeG1sLCBuZWVkcyBmYWtlYm9keSB0b28uICMyNzBcclxuICAgICghYm9keS5mYWtlID8gZGl2IDogYm9keSkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xyXG5cclxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XHJcbiAgICB9XHJcbiAgICBkaXYuaWQgPSBtb2Q7XHJcblxyXG4gICAgaWYgKGJvZHkuZmFrZSkge1xyXG4gICAgICAvL2F2b2lkIGNyYXNoaW5nIElFOCwgaWYgYmFja2dyb3VuZCBpbWFnZSBpcyB1c2VkXHJcbiAgICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xyXG4gICAgICAvL1NhZmFyaSA1LjEzLzUuMS40IE9TWCBzdG9wcyBsb2FkaW5nIGlmIDo6LXdlYmtpdC1zY3JvbGxiYXIgaXMgdXNlZCBhbmQgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZVxyXG4gICAgICBib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcclxuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKGJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldCA9IGNhbGxiYWNrKGRpdiwgcnVsZSk7XHJcbiAgICAvLyBJZiB0aGlzIGlzIGRvbmUgYWZ0ZXIgcGFnZSBsb2FkIHdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBib2R5IHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXHJcbiAgICBpZiAoYm9keS5mYWtlKSB7XHJcbiAgICAgIGJvZHkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib2R5KTtcclxuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xyXG4gICAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xyXG4gICAgICBkb2NFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICEhcmV0O1xyXG5cclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogZG9tVG9DU1MgdGFrZXMgYSBjYW1lbENhc2Ugc3RyaW5nIGFuZCBjb252ZXJ0cyBpdCB0byBrZWJhYi1jYXNlXHJcbiAgICogZS5nLiBib3hTaXppbmcgLT4gYm94LXNpemluZ1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGRvbVRvQ1NTXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBTdHJpbmcgbmFtZSBvZiBjYW1lbENhc2UgcHJvcCB3ZSB3YW50IHRvIGNvbnZlcnRcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUga2ViYWItY2FzZSB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBuYW1lXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGRvbVRvQ1NTKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oc3RyLCBtMSkge1xyXG4gICAgICByZXR1cm4gJy0nICsgbTEudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pLnJlcGxhY2UoL15tcy0vLCAnLW1zLScpO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIG5hdGl2ZVRlc3RQcm9wcyBhbGxvd3MgZm9yIHVzIHRvIHVzZSBuYXRpdmUgZmVhdHVyZSBkZXRlY3Rpb24gZnVuY3Rpb25hbGl0eSBpZiBhdmFpbGFibGUuXHJcbiAgICogc29tZSBwcmVmaXhlZCBmb3JtLCBvciBmYWxzZSwgaW4gdGhlIGNhc2Ugb2YgYW4gdW5zdXBwb3J0ZWQgcnVsZVxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIG5hdGl2ZVRlc3RQcm9wc1xyXG4gICAqIEBwYXJhbSB7YXJyYXl9IHByb3BzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIHdlIHdhbnQgdG8gY2hlY2sgdmlhIEBzdXBwb3J0c1xyXG4gICAqIEByZXR1cm5zIHtib29sZWFufHVuZGVmaW5lZH0gQSBib29sZWFuIHdoZW4gQHN1cHBvcnRzIGV4aXN0cywgdW5kZWZpbmVkIG90aGVyd2lzZVxyXG4gICAqL1xyXG5cclxuICAvLyBBY2NlcHRzIGEgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgYSBzaW5nbGUgdmFsdWVcclxuICAvLyBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5hdGl2ZSBkZXRlY3Rpb24gbm90IGF2YWlsYWJsZVxyXG4gIGZ1bmN0aW9uIG5hdGl2ZVRlc3RQcm9wcyhwcm9wcywgdmFsdWUpIHtcclxuICAgIHZhciBpID0gcHJvcHMubGVuZ3RoO1xyXG4gICAgLy8gU3RhcnQgd2l0aCB0aGUgSlMgQVBJOiBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbmRpdGlvbmFsLyN0aGUtY3NzLWludGVyZmFjZVxyXG4gICAgaWYgKCdDU1MnIGluIHdpbmRvdyAmJiAnc3VwcG9ydHMnIGluIHdpbmRvdy5DU1MpIHtcclxuICAgICAgLy8gVHJ5IGV2ZXJ5IHByZWZpeGVkIHZhcmlhbnQgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICBpZiAod2luZG93LkNTUy5zdXBwb3J0cyhkb21Ub0NTUyhwcm9wc1tpXSksIHZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gYXQtcnVsZSAoZm9yIE9wZXJhIDEyLngpXHJcbiAgICBlbHNlIGlmICgnQ1NTU3VwcG9ydHNSdWxlJyBpbiB3aW5kb3cpIHtcclxuICAgICAgLy8gQnVpbGQgYSBjb25kaXRpb24gc3RyaW5nIGZvciBldmVyeSBwcmVmaXhlZCB2YXJpYW50XHJcbiAgICAgIHZhciBjb25kaXRpb25UZXh0ID0gW107XHJcbiAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICBjb25kaXRpb25UZXh0LnB1c2goJygnICsgZG9tVG9DU1MocHJvcHNbaV0pICsgJzonICsgdmFsdWUgKyAnKScpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbmRpdGlvblRleHQgPSBjb25kaXRpb25UZXh0LmpvaW4oJyBvciAnKTtcclxuICAgICAgcmV0dXJuIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKCdAc3VwcG9ydHMgKCcgKyBjb25kaXRpb25UZXh0ICsgJykgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH0nLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkucG9zaXRpb24gPT0gJ2Fic29sdXRlJztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGNzc1RvRE9NIHRha2VzIGEga2ViYWItY2FzZSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IHRvIGNhbWVsQ2FzZVxyXG4gICAqIGUuZy4gYm94LXNpemluZyAtPiBib3hTaXppbmdcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBjc3NUb0RPTVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gU3RyaW5nIG5hbWUgb2Yga2ViYWItY2FzZSBwcm9wIHdlIHdhbnQgdG8gY29udmVydFxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjYW1lbENhc2UgdmVyc2lvbiBvZiB0aGUgc3VwcGxpZWQgbmFtZVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBjc3NUb0RPTShuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC8oW2Etel0pLShbYS16XSkvZywgZnVuY3Rpb24oc3RyLCBtMSwgbTIpIHtcclxuICAgICAgcmV0dXJuIG0xICsgbTIudG9VcHBlckNhc2UoKTtcclxuICAgIH0pLnJlcGxhY2UoL14tLywgJycpO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8vIHRlc3RQcm9wcyBpcyBhIGdlbmVyaWMgQ1NTIC8gRE9NIHByb3BlcnR5IHRlc3QuXHJcblxyXG4gIC8vIEluIHRlc3Rpbmcgc3VwcG9ydCBmb3IgYSBnaXZlbiBDU1MgcHJvcGVydHksIGl0J3MgbGVnaXQgdG8gdGVzdDpcclxuICAvLyAgICBgZWxlbS5zdHlsZVtzdHlsZU5hbWVdICE9PSB1bmRlZmluZWRgXHJcbiAgLy8gSWYgdGhlIHByb3BlcnR5IGlzIHN1cHBvcnRlZCBpdCB3aWxsIHJldHVybiBhbiBlbXB0eSBzdHJpbmcsXHJcbiAgLy8gaWYgdW5zdXBwb3J0ZWQgaXQgd2lsbCByZXR1cm4gdW5kZWZpbmVkLlxyXG5cclxuICAvLyBXZSdsbCB0YWtlIGFkdmFudGFnZSBvZiB0aGlzIHF1aWNrIHRlc3QgYW5kIHNraXAgc2V0dGluZyBhIHN0eWxlXHJcbiAgLy8gb24gb3VyIG1vZGVybml6ciBlbGVtZW50LCBidXQgaW5zdGVhZCBqdXN0IHRlc3RpbmcgdW5kZWZpbmVkIHZzXHJcbiAgLy8gZW1wdHkgc3RyaW5nLlxyXG5cclxuICAvLyBQcm9wZXJ0eSBuYW1lcyBjYW4gYmUgcHJvdmlkZWQgaW4gZWl0aGVyIGNhbWVsQ2FzZSBvciBrZWJhYi1jYXNlLlxyXG5cclxuICBmdW5jdGlvbiB0ZXN0UHJvcHMocHJvcHMsIHByZWZpeGVkLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xyXG4gICAgc2tpcFZhbHVlVGVzdCA9IGlzKHNraXBWYWx1ZVRlc3QsICd1bmRlZmluZWQnKSA/IGZhbHNlIDogc2tpcFZhbHVlVGVzdDtcclxuXHJcbiAgICAvLyBUcnkgbmF0aXZlIGRldGVjdCBmaXJzdFxyXG4gICAgaWYgKCFpcyh2YWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBuYXRpdmVUZXN0UHJvcHMocHJvcHMsIHZhbHVlKTtcclxuICAgICAgaWYgKCFpcyhyZXN1bHQsICd1bmRlZmluZWQnKSkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBPdGhlcndpc2UgZG8gaXQgcHJvcGVybHlcclxuICAgIHZhciBhZnRlckluaXQsIGksIHByb3BzTGVuZ3RoLCBwcm9wLCBiZWZvcmU7XHJcblxyXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHN0eWxlIGVsZW1lbnQsIHRoYXQgbWVhbnMgd2UncmUgcnVubmluZyBhc3luYyBvciBhZnRlclxyXG4gICAgLy8gdGhlIGNvcmUgdGVzdHMsIHNvIHdlJ2xsIG5lZWQgdG8gY3JlYXRlIG91ciBvd24gZWxlbWVudHMgdG8gdXNlXHJcblxyXG4gICAgLy8gaW5zaWRlIG9mIGFuIFNWRyBlbGVtZW50LCBpbiBjZXJ0YWluIGJyb3dzZXJzLCB0aGUgYHN0eWxlYCBlbGVtZW50IGlzIG9ubHlcclxuICAgIC8vIGRlZmluZWQgZm9yIHZhbGlkIHRhZ3MuIFRoZXJlZm9yZSwgaWYgYG1vZGVybml6cmAgZG9lcyBub3QgaGF2ZSBvbmUsIHdlXHJcbiAgICAvLyBmYWxsIGJhY2sgdG8gYSBsZXNzIHVzZWQgZWxlbWVudCBhbmQgaG9wZSBmb3IgdGhlIGJlc3QuXHJcbiAgICB2YXIgZWxlbXMgPSBbJ21vZGVybml6cicsICd0c3BhbiddO1xyXG4gICAgd2hpbGUgKCFtU3R5bGUuc3R5bGUpIHtcclxuICAgICAgYWZ0ZXJJbml0ID0gdHJ1ZTtcclxuICAgICAgbVN0eWxlLm1vZEVsZW0gPSBjcmVhdGVFbGVtZW50KGVsZW1zLnNoaWZ0KCkpO1xyXG4gICAgICBtU3R5bGUuc3R5bGUgPSBtU3R5bGUubW9kRWxlbS5zdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWxldGUgdGhlIG9iamVjdHMgaWYgd2UgY3JlYXRlZCB0aGVtLlxyXG4gICAgZnVuY3Rpb24gY2xlYW5FbGVtcygpIHtcclxuICAgICAgaWYgKGFmdGVySW5pdCkge1xyXG4gICAgICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XHJcbiAgICAgICAgZGVsZXRlIG1TdHlsZS5tb2RFbGVtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGg7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHNMZW5ndGg7IGkrKykge1xyXG4gICAgICBwcm9wID0gcHJvcHNbaV07XHJcbiAgICAgIGJlZm9yZSA9IG1TdHlsZS5zdHlsZVtwcm9wXTtcclxuXHJcbiAgICAgIGlmIChjb250YWlucyhwcm9wLCAnLScpKSB7XHJcbiAgICAgICAgcHJvcCA9IGNzc1RvRE9NKHByb3ApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobVN0eWxlLnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdmFsdWUgdG8gdGVzdCBoYXMgYmVlbiBwYXNzZWQgaW4sIGRvIGEgc2V0LWFuZC1jaGVjayB0ZXN0LlxyXG4gICAgICAgIC8vIDAgKGludGVnZXIpIGlzIGEgdmFsaWQgcHJvcGVydHkgdmFsdWUsIHNvIGNoZWNrIHRoYXQgYHZhbHVlYCBpc24ndFxyXG4gICAgICAgIC8vIHVuZGVmaW5lZCwgcmF0aGVyIHRoYW4ganVzdCBjaGVja2luZyBpdCdzIHRydXRoeS5cclxuICAgICAgICBpZiAoIXNraXBWYWx1ZVRlc3QgJiYgIWlzKHZhbHVlLCAndW5kZWZpbmVkJykpIHtcclxuXHJcbiAgICAgICAgICAvLyBOZWVkcyBhIHRyeSBjYXRjaCBibG9jayBiZWNhdXNlIG9mIG9sZCBJRS4gVGhpcyBpcyBzbG93LCBidXQgd2lsbFxyXG4gICAgICAgICAgLy8gYmUgYXZvaWRlZCBpbiBtb3N0IGNhc2VzIGJlY2F1c2UgYHNraXBWYWx1ZVRlc3RgIHdpbGwgYmUgdXNlZC5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIG1TdHlsZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgcHJvcGVydHkgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIGFzc3VtZSB0aGUgdmFsdWUgdXNlZCBpc1xyXG4gICAgICAgICAgLy8gc3VwcG9ydGVkLiBJZiBgdmFsdWVgIGlzIGVtcHR5IHN0cmluZywgaXQnbGwgZmFpbCBoZXJlIChiZWNhdXNlXHJcbiAgICAgICAgICAvLyBpdCBoYXNuJ3QgY2hhbmdlZCksIHdoaWNoIG1hdGNoZXMgaG93IGJyb3dzZXJzIGhhdmUgaW1wbGVtZW50ZWRcclxuICAgICAgICAgIC8vIENTUy5zdXBwb3J0cygpXHJcbiAgICAgICAgICBpZiAobVN0eWxlLnN0eWxlW3Byb3BdICE9IGJlZm9yZSkge1xyXG4gICAgICAgICAgICBjbGVhbkVsZW1zKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UganVzdCByZXR1cm4gdHJ1ZSwgb3IgdGhlIHByb3BlcnR5IG5hbWUgaWYgdGhpcyBpcyBhXHJcbiAgICAgICAgLy8gYHByZWZpeGVkKClgIGNhbGxcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNsZWFuRWxlbXMoKTtcclxuICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYW5FbGVtcygpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiB0ZXN0UHJvcCgpIGludmVzdGlnYXRlcyB3aGV0aGVyIGEgZ2l2ZW4gc3R5bGUgcHJvcGVydHkgaXMgcmVjb2duaXplZFxyXG4gICAqIFByb3BlcnR5IG5hbWVzIGNhbiBiZSBwcm92aWRlZCBpbiBlaXRoZXIgY2FtZWxDYXNlIG9yIGtlYmFiLWNhc2UuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnRlc3RQcm9wXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIudGVzdFByb3AoKVxyXG4gICAqIEBvcHRpb25Qcm9wIHRlc3RQcm9wXHJcbiAgICogQGZ1bmN0aW9uIHRlc3RQcm9wXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgLSBOYW1lIG9mIHRoZSBDU1MgcHJvcGVydHkgdG8gY2hlY2tcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlXSAtIE5hbWUgb2YgdGhlIENTUyB2YWx1ZSB0byBjaGVja1xyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZVZhbHVlXSAtIFdoZXRoZXIgb3Igbm90IHRvIGNoZWNrIHRoZSB2YWx1ZSBpZiBAc3VwcG9ydHMgaXNuJ3Qgc3VwcG9ydGVkXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICogQGV4YW1wbGVcclxuICAgKlxyXG4gICAqIEp1c3QgbGlrZSBbdGVzdEFsbFByb3BzXSgjbW9kZXJuaXpyLXRlc3RhbGxwcm9wcyksIG9ubHkgaXQgZG9lcyBub3QgY2hlY2sgYW55IHZlbmRvciBwcmVmaXhlZFxyXG4gICAqIHZlcnNpb24gb2YgdGhlIHN0cmluZy5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCB0aGUgcHJvcGVydHkgbmFtZSBtdXN0IGJlIHByb3ZpZGVkIGluIGNhbWVsQ2FzZSAoZS5nLiBib3hTaXppbmcgbm90IGJveC1zaXppbmcpXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci50ZXN0UHJvcCgncG9pbnRlckV2ZW50cycpICAvLyB0cnVlXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBZb3UgY2FuIGFsc28gcHJvdmlkZSBhIHZhbHVlIGFzIGFuIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBjaGVjayBpZiBhXHJcbiAgICogc3BlY2lmaWMgdmFsdWUgaXMgc3VwcG9ydGVkXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci50ZXN0UHJvcCgncG9pbnRlckV2ZW50cycsICdub25lJykgLy8gdHJ1ZVxyXG4gICAqIE1vZGVybml6ci50ZXN0UHJvcCgncG9pbnRlckV2ZW50cycsICdwZW5ndWluJykgLy8gZmFsc2VcclxuICAgKiBgYGBcclxuICAgKi9cclxuXHJcbiAgdmFyIHRlc3RQcm9wID0gTW9kZXJuaXpyUHJvdG8udGVzdFByb3AgPSBmdW5jdGlvbihwcm9wLCB2YWx1ZSwgdXNlVmFsdWUpIHtcclxuICAgIHJldHVybiB0ZXN0UHJvcHMoW3Byb3BdLCB1bmRlZmluZWQsIHZhbHVlLCB1c2VWYWx1ZSk7XHJcbiAgfTtcclxuICBcclxuXHJcbiAgLyoqXHJcbiAgICogZm5CaW5kIGlzIGEgc3VwZXIgc21hbGwgW2JpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpIHBvbHlmaWxsLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGZuQmluZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gYSBmdW5jdGlvbiB5b3Ugd2FudCB0byBjaGFuZ2UgYHRoaXNgIHJlZmVyZW5jZSB0b1xyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0aGF0IC0gdGhlIGB0aGlzYCB5b3Ugd2FudCB0byBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoXHJcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgd3JhcHBlZCB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBmdW5jdGlvblxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBmbkJpbmQoZm4sIHRoYXQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgO1xyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIkNvb2tpZXNcIixcclxuICBcInByb3BlcnR5XCI6IFwiY29va2llc1wiLFxyXG4gIFwidGFnc1wiOiBbXCJzdG9yYWdlXCJdLFxyXG4gIFwiYXV0aG9yc1wiOiBbXCJ0YXVyZW5cIl1cclxufVxyXG4hKi9cclxuLyogRE9DXHJcbkRldGVjdHMgd2hldGhlciBjb29raWUgc3VwcG9ydCBpcyBlbmFibGVkLlxyXG4qL1xyXG5cclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMTkxXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjb29raWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBuYXZpZ2F0b3IuY29va2llRW5hYmxlZCBjYW5ub3QgZGV0ZWN0IGN1c3RvbSBvciBudWFuY2VkIGNvb2tpZSBibG9ja2luZ1xyXG4gICAgLy8gY29uZmlndXJhdGlvbnMuIEZvciBleGFtcGxlLCB3aGVuIGJsb2NraW5nIGNvb2tpZXMgdmlhIHRoZSBBZHZhbmNlZFxyXG4gICAgLy8gUHJpdmFjeSBTZXR0aW5ncyBpbiBJRTksIGl0IGFsd2F5cyByZXR1cm5zIHRydWUuIEFuZCB0aGVyZSBoYXZlIGJlZW5cclxuICAgIC8vIGlzc3VlcyBpbiB0aGUgcGFzdCB3aXRoIHNpdGUtc3BlY2lmaWMgZXhjZXB0aW9ucy5cclxuICAgIC8vIERvbid0IHJlbHkgb24gaXQuXHJcblxyXG4gICAgLy8gdHJ5Li5jYXRjaCBiZWNhdXNlIHNvbWUgaW4gc2l0dWF0aW9ucyBgZG9jdW1lbnQuY29va2llYCBpcyBleHBvc2VkIGJ1dCB0aHJvd3MgYVxyXG4gICAgLy8gU2VjdXJpdHlFcnJvciBpZiB5b3UgdHJ5IHRvIGFjY2VzcyBpdDsgZS5nLiBkb2N1bWVudHMgY3JlYXRlZCBmcm9tIGRhdGEgVVJJc1xyXG4gICAgLy8gb3IgaW4gc2FuZGJveGVkIGlmcmFtZXMgKGRlcGVuZGluZyBvbiBmbGFncy9jb250ZXh0KVxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gQ3JlYXRlIGNvb2tpZVxyXG4gICAgICBkb2N1bWVudC5jb29raWUgPSAnY29va2lldGVzdD0xJztcclxuICAgICAgdmFyIHJldCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKCdjb29raWV0ZXN0PScpICE9IC0xO1xyXG4gICAgICAvLyBEZWxldGUgY29va2llXHJcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdjb29raWV0ZXN0PTE7IGV4cGlyZXM9VGh1LCAwMS1KYW4tMTk3MCAwMDowMDowMSBHTVQnO1xyXG4gICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJTVkdcIixcclxuICBcInByb3BlcnR5XCI6IFwic3ZnXCIsXHJcbiAgXCJjYW5pdXNlXCI6IFwic3ZnXCIsXHJcbiAgXCJ0YWdzXCI6IFtcInN2Z1wiXSxcclxuICBcImF1dGhvcnNcIjogW1wiRXJpayBEYWhsc3Ryb21cIl0sXHJcbiAgXCJwb2x5ZmlsbHNcIjogW1xyXG4gICAgXCJzdmd3ZWJcIixcclxuICAgIFwicmFwaGFlbFwiLFxyXG4gICAgXCJhbXBsZXNka1wiLFxyXG4gICAgXCJjYW52Z1wiLFxyXG4gICAgXCJzdmctYm9pbGVycGxhdGVcIixcclxuICAgIFwic2llXCIsXHJcbiAgICBcImRvam9nZnhcIixcclxuICAgIFwiZmFicmljanNcIlxyXG4gIF1cclxufVxyXG4hKi9cclxuLyogRE9DXHJcbkRldGVjdHMgc3VwcG9ydCBmb3IgU1ZHIGluIGA8ZW1iZWQ+YCBvciBgPG9iamVjdD5gIGVsZW1lbnRzLlxyXG4qL1xyXG5cclxuICBNb2Rlcm5penIuYWRkVGVzdCgnc3ZnJywgISFkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgISFkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpLmNyZWF0ZVNWR1JlY3QpO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJTVkcgYXMgYW4gPGltZz4gdGFnIHNvdXJjZVwiLFxyXG4gIFwicHJvcGVydHlcIjogXCJzdmdhc2ltZ1wiLFxyXG4gIFwiY2FuaXVzZVwiIDogXCJzdmctaW1nXCIsXHJcbiAgXCJ0YWdzXCI6IFtcInN2Z1wiXSxcclxuICBcImF1dGhvcnNcIjogW1wiQ2hyaXMgQ295aWVyXCJdLFxyXG4gIFwibm90ZXNcIjogW3tcclxuICAgIFwibmFtZVwiOiBcIkhUTUw1IFNwZWNcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2VtYmVkZGVkLWNvbnRlbnQtMC5odG1sI3RoZS1pbWctZWxlbWVudFwiXHJcbiAgfV1cclxufVxyXG4hKi9cclxuXHJcblxyXG4gIC8vIE9yaWdpbmFsIEFzeW5jIHRlc3QgYnkgU3R1IENveFxyXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2NocmlzY295aWVyLzg3NzQ1MDFcclxuXHJcbiAgLy8gTm93IGEgU3luYyB0ZXN0IGJhc2VkIG9uIGdvb2QgcmVzdWx0cyBoZXJlXHJcbiAgLy8gaHR0cDovL2NvZGVwZW4uaW8vY2hyaXNjb3lpZXIvcGVuL2JBREZ4XHJcblxyXG4gIC8vIE5vdGUgaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZSBpcyAqc3VwcG9zZWQqIHRvIHJlcHJlc2VudFxyXG4gIC8vIHN1cHBvcnQgZm9yIHRoZSBgPGltYWdlPmAgdGFnIGluIFNWRywgbm90IGFuIFNWRyBmaWxlIGxpbmtlZCBmcm9tIGFuIGA8aW1nPmBcclxuICAvLyB0YWcgaW4gSFRNTCDigJMgYnV0IGl04oCZcyBhIGhldXJpc3RpYyB3aGljaCB3b3Jrc1xyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdmdhc2ltZycsIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoJ2h0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjSW1hZ2UnLCAnMS4xJykpO1xyXG5cclxuXHJcbiAgLy8gUnVuIGVhY2ggdGVzdFxyXG4gIHRlc3RSdW5uZXIoKTtcclxuXHJcbiAgZGVsZXRlIE1vZGVybml6clByb3RvLmFkZFRlc3Q7XHJcbiAgZGVsZXRlIE1vZGVybml6clByb3RvLmFkZEFzeW5jVGVzdDtcclxuXHJcbiAgLy8gUnVuIHRoZSB0aGluZ3MgdGhhdCBhcmUgc3VwcG9zZWQgdG8gcnVuIGFmdGVyIHRoZSB0ZXN0c1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTW9kZXJuaXpyLl9xLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBNb2Rlcm5penIuX3FbaV0oKTtcclxuICB9XHJcblxyXG4gIC8vIExlYWsgTW9kZXJuaXpyIG5hbWVzcGFjZVxyXG4gIHdpbmRvdy5Nb2Rlcm5penIgPSBNb2Rlcm5penI7XHJcblxyXG5cclxuO1xyXG5cclxufSkod2luZG93LCBkb2N1bWVudCk7IiwiLypcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IE1pa2UgS2luZyAoQG1pY2phbWtpbmcpXHJcbiAqXHJcbiAqIGpRdWVyeSBTdWNjaW5jdCBwbHVnaW5cclxuICogVmVyc2lvbiAxLjEuMCAoT2N0b2JlciAyMDE0KVxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4gLypnbG9iYWwgalF1ZXJ5Ki9cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdCQuZm4uc3VjY2luY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQoe1xyXG5cdFx0XHRcdHNpemU6IDI0MCxcclxuXHRcdFx0XHRvbWlzc2lvbjogJy4uLicsXHJcblx0XHRcdFx0aWdub3JlOiB0cnVlXHJcblx0XHRcdH0sIG9wdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHR2YXIgdGV4dERlZmF1bHQsXHJcblx0XHRcdFx0dGV4dFRydW5jYXRlZCxcclxuXHRcdFx0XHRlbGVtZW50cyA9ICQodGhpcyksXHJcblx0XHRcdFx0cmVnZXggICAgPSAvWyEtXFwvOi1AXFxbLWB7LX5dJC8sXHJcblx0XHRcdFx0aW5pdCAgICAgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHRleHREZWZhdWx0ID0gJCh0aGlzKS5odG1sKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGV4dERlZmF1bHQubGVuZ3RoID4gc2V0dGluZ3Muc2l6ZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRUcnVuY2F0ZWQgPSAkLnRyaW0odGV4dERlZmF1bHQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIHNldHRpbmdzLnNpemUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuc3BsaXQoJyAnKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnNsaWNlKDAsIC0xKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmpvaW4oJyAnKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHNldHRpbmdzLmlnbm9yZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dFRydW5jYXRlZCA9IHRleHRUcnVuY2F0ZWQucmVwbGFjZShyZWdleCwgJycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5odG1sKHRleHRUcnVuY2F0ZWQgKyBzZXR0aW5ncy5vbWlzc2lvbik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdGluaXQoKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcbn0pKGpRdWVyeSk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjQ09NTU9OXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3JjL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmJvcmdlYnkgPSB3aW5kb3cuYm9yZ2VieSB8fCB7fTtcclxuYm9yZ2VieS5tb2R1bGVzID0gYm9yZ2VieS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQ29tbW9uIG1ldGhvZHMgbW9kdWxlXHJcbiAqL1xyXG5ib3JnZWJ5Lm1vZHVsZXMuY29tbW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwdWIgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGYWRlIGF3YXkgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHViLmhpZGVDb250ZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAkKGVsZW1lbnQpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBvcGFjaXR5OiBcIjBcIlxyXG4gICAgICAgIH0sIDMwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNsaWRlVXAoMzAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEV4cG9zZSB0aGUgcHVibGljIG1ldGhvZHNcclxuICAgIHJldHVybiBwdWI7XHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjQ09PS0lFU1xyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1NyYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5ib3JnZWJ5ID0gd2luZG93LmJvcmdlYnkgfHwge307XHJcbmJvcmdlYnkubW9kdWxlcyA9IGJvcmdlYnkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIENvb2tpZSBoYW5kbGluZyBtb2R1bGVcclxuICovXHJcbmJvcmdlYnkubW9kdWxlcy5jb29raWVzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwdWIgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY29va2llXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSBjb29raWUsIG9yIG51bGwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1Yi5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgIHZhciBuYW1lRXEgPSBuYW1lICsgXCI9XCI7XHJcbiAgICAgICAgdmFyIHN0b3JlZENvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZENvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHN0b3JlZENvb2tpZXNbaV07XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY29va2llLmNoYXJBdCgwKSA9PT0gXCIgXCIpXHJcbiAgICAgICAgICAgICAgICBjb29raWUgPSBjb29raWUuc3Vic3RyaW5nKDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvb2tpZS5pbmRleE9mKG5hbWVFcSkgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb2tpZS5zdWJzdHJpbmcobmFtZUVxLmxlbmd0aCwgY29va2llLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNvb2tpZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGV4cGlyYXRpb25EYXlzXHJcbiAgICAgKi9cclxuICAgIHB1Yi5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGV4cGlyYXRpb25EYXlzKSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcmF0aW9uRGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTsgIC8vIHtkYXlzfSAqIDI0aCAqIDYwbWluICogNjBzZWMgKiAxMDAwbXNcclxuICAgICAgICB2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiOyBleHBpcmVzPVwiICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgbWV0aG9kc1xyXG4gICAgcmV0dXJuIHB1YjtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjU0VTU0lPTi1TVE9SQUdFXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3JjL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmJvcmdlYnkgPSB3aW5kb3cuYm9yZ2VieSB8fCB7fTtcclxuYm9yZ2VieS5tb2R1bGVzID0gYm9yZ2VieS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogU2Vzc2lvbiBzdG9yYWdlIG1vZHVsZVxyXG4gKi9cclxuYm9yZ2VieS5tb2R1bGVzLnNlc3Npb25TdG9yYWdlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwdWIgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgc2Vzc2lvbiBzdG9yYWdlIGl0ZW1cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdmFsdWUgb2YgdGhlIHNlc3Npb24gc3RvcmFnZSBpdGVtLCBvciBudWxsIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBwdWIuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShuYW1lKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHNlc3Npb24gc3RvcmFnZSBpdGVtXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWxlcnRJZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1Yi5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKG5hbWUsIHZhbHVlKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgbWV0aG9kc1xyXG4gICAgcmV0dXJuIHB1YjtcclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNCUk9XU0VSLVdJRFRIXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3JjL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmJvcmdlYnkgPSB3aW5kb3cuYm9yZ2VieSB8fCB7fTtcclxuYm9yZ2VieS5tb2R1bGVzID0gYm9yZ2VieS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQnJvd3NlciB3aWR0aFxyXG4gKi9cclxuYm9yZ2VieS5tb2R1bGVzLmJyb3dzZXJXaWR0aCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHViID0ge307XHJcbiAgICB2YXIgYnJvd3NlcldpZHRoO1xyXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gMTg7XHJcbiAgICB2YXIgYnJlYWtwb2ludCA9IHtcclxuICAgICAgICB0YWJsZXRTdGFydDogNzY4LFxyXG4gICAgICAgIGRlc2t0b3BTdGFydDogMTAyNFxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gbW9iaWxlIGJyZWFrcG9pbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBwdWIuaXNNb2JpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgcmV0dXJuIGJyb3dzZXJXaWR0aCA8IGJyZWFrcG9pbnQudGFibGV0U3RhcnQgLSBzY3JvbGxiYXJXaWR0aDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIHRhYmxldCBicmVha3BvaW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHViLmlzVGFibGV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJyb3dzZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIHJldHVybiAoYnJvd3NlcldpZHRoID49IGJyZWFrcG9pbnQudGFibGV0U3RhcnQgLSBzY3JvbGxiYXJXaWR0aCkgJiYgKGJyb3dzZXJXaWR0aCA8IGJyZWFrcG9pbnQuZGVza3RvcFN0YXJ0IC0gc2Nyb2xsYmFyV2lkdGgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gZGVza3RvcCBicmVha3BvaW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHViLmlzRGVza3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBicm93c2VyV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICByZXR1cm4gYnJvd3NlcldpZHRoID49IGJyZWFrcG9pbnQuZGVza3RvcFN0YXJ0IC0gc2Nyb2xsYmFyV2lkdGg7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBFeHBvc2UgcHVibGljIG1ldGhvZHNcclxuICAgIHJldHVybiBwdWI7XHJcblxyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI1BPTFlGSUxMU1xyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1NyYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5ib3JnZWJ5ID0gd2luZG93LmJvcmdlYnkgfHwge307XHJcbmJvcmdlYnkubW9kdWxlcyA9IGJvcmdlYnkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFBvbHlmaWxscyBtb2R1bGVcclxuICovXHJcbmJvcmdlYnkubW9kdWxlcy5wb2x5ZmlsbHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjQ09MTEFQU0VcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TcmMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuYm9yZ2VieSA9IHdpbmRvdy5ib3JnZWJ5IHx8IHt9O1xyXG5ib3JnZWJ5Lm1vZHVsZXMgPSBib3JnZWJ5Lm1vZHVsZXMgfHwge307XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBDb2xsYXBzZSBtb2R1bGVcclxuICovXHJcbmJvcmdlYnkubW9kdWxlcy5jb2xsYXBzZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHJpdiA9IHt9O1xyXG4gICAgdmFyIGJyb3dzZXJXaWR0aDtcclxuICAgIHZhciByZXNpemVUaW1lcjtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG4gICAgICAgIHByaXYuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIHByaXYucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIHByaXYuYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2luZG93IHJlc2l6ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XHJcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcml2LnJlc2l6ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2xpY2sgb24gY29sbGFwc2UgY29udHJvbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoXCIuanMtY29sbGFwc2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRyb2wgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKFwidGFyZ2V0XCIpO1xyXG4gICAgICAgICAgICB2YXIgaXNEaXNhYmxlZCA9IHByaXYuaXNEaXNhYmxlZChjb250cm9sKTtcclxuICAgICAgICAgICAgdmFyIGlzRXhwYW5kZWQgPSBwcml2LmlzRXhwYW5kZWQoY29udHJvbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBjb2xsYXBzZSBpcyBkaXNhYmxlZCAtIHVzZSBkZWZhdWx0IGxpbmsgYmVoYXZpb3VyXHJcbiAgICAgICAgICAgIGlmIChpc0Rpc2FibGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgY29sbGFwc2UgaXMgbm90IGRpc2FibGVkIC0gcHJldmVudCBkZWZhdWx0IGxpbmsgYmVoYXZpb3VyIGFuZCB1c2UgY29sbGFwc2UgZnVuY3Rpb25cclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICAgICAgcHJpdi5oaWRlKGNvbnRyb2wsIHRhcmdldCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHByaXYuc2hvdyhjb250cm9sLCB0YXJnZXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2xpY2sgb24gY29sbGFwc2UgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChcIi5qcy1jb2xsYXBzZS1jbG9zZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgLy8gRmluZCBhbGwgY29udHJvbHMgZm9yIGNvbGxhcHNlIHRhcmdldCAoY291bGQgYmUgbXVsdGlwbGUpXHJcbiAgICAgICAgICAgIHZhciBjb250cm9scyA9ICQoXCIuanMtY29sbGFwc2VbZGF0YS10YXJnZXQ9J1wiICsgdGFyZ2V0ICsgXCInXCIpO1xyXG5cclxuICAgICAgICAgICAgY29udHJvbHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcml2LmhpZGUodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgYnJvd3NlclxyXG4gICAgICovXHJcbiAgICBwcml2LnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNJbkVkaXRNb2RlID0gJChcImh0bWxcIikuaGFzQ2xhc3MoXCJlZGl0LW1vZGVcIik7XHJcbiAgICAgICAgdmFyIG5ld0Jyb3dzZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoYXNSZXNpemVkSG9yaXpvbnRhbGx5ID0gbmV3QnJvd3NlcldpZHRoICE9PSBicm93c2VyV2lkdGg7XHJcblxyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgaWYgYnJvd3NlciB3aWR0aCBoYXNuJ3QgY2hhbmdlZFxyXG4gICAgICAgIGlmICghaGFzUmVzaXplZEhvcml6b250YWxseSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBJZiB3aWR0aCBoYXMgY2hhbmdlZCwgdXBkYXRlIGdsb2JhbCB2YXJpYWJsZVxyXG4gICAgICAgIGJyb3dzZXJXaWR0aCA9IG5ld0Jyb3dzZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gSWYgTk9UIGluIEVQaVNlcnZlciBlZGl0IG1vZGUsIHJlZnJlc2ggYWxsIGNvbGxhcHNlcyBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICAgICAgaWYgKCFpc0luRWRpdE1vZGUpXHJcbiAgICAgICAgICAgIHByaXYucmVmcmVzaCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIGFsbCBjb2xsYXBzZXNcclxuICAgICAqL1xyXG4gICAgcHJpdi5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBsb2NhdGlvbi5zZWFyY2g7XHJcbiAgICAgICAgdmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgcGFyYW1ldGVycyB3YXMgcHJvdmlkZWQgaW4gVVJMXHJcbiAgICAgICAgaWYgKHBhcmFtcykge1xyXG4gICAgICAgICAgICAvLyBTcGxpdCBwYXJhbXNcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLnN1YnN0cigxKS5zcGxpdChcIiZcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggYWxsIHBhcmFtc1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gU3BsaXQgcGFyYW1ldGVyIG9uIGVxdWFsIHNpZ24gdG8gZXh0cmFjdCBib3RoIG5hbWUgYW5kIHZhbHVlXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFBhcmFtID0gcGFyYW1zW2ldLnNwbGl0KFwiPVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBwYXJhbSBuYW1lIGlzIFwiaWRcIlxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQYXJhbVswXSA9PT0gXCJpZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGV4cGFuZGVkIGNsYXNzIHRvIGNvcnJlc3BvbmRpbmcgY29sbGFwc2UgY29udHJvbFxyXG4gICAgICAgICAgICAgICAgICAgICQoXCIjXCIgKyBjdXJyZW50UGFyYW1bMV0pLmFkZENsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIGhhc2ggaXMgcHJvdmlkZWQgaW4gVVJMXHJcbiAgICAgICAgaWYgKGhhc2gpIHtcclxuICAgICAgICAgICAgLy8gQWRkIGV4cGFuZGVkIGNsYXNzIHRvIGNvbGxhcHNlIHRhcmdldCAoaWYgaXQgaXMgZm91bmQpXHJcbiAgICAgICAgICAgICQoaGFzaCkuYWRkQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvb3AgdGhyb3VnaCBhbGwgY29sbGFwc2VzIGFuZCBleHBhbmQgdGhlIG9uZXMgdGhhdCBzaG91bGQgYmVcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKFwiLmpzLWNvbGxhcHNlXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udHJvbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGNvbnRyb2wpLmRhdGEoXCJ0YXJnZXRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNEaXNhYmxlZCA9IHByaXYuaXNEaXNhYmxlZChjb250cm9sKTtcclxuICAgICAgICAgICAgdmFyIGlzRXhwYW5kZWQgPSBwcml2LmlzRXhwYW5kZWQodGFyZ2V0KTtcclxuICAgICAgICAgICAgdmFyIHNob3VsZEJlRXhwYW5kZWQgPSBwcml2LmlzRXhwYW5kZWQoY29udHJvbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoKGlzRGlzYWJsZWQgJiYgIWlzRXhwYW5kZWQpIHx8IChzaG91bGRCZUV4cGFuZGVkICYmICFpc0V4cGFuZGVkKSkge1xyXG4gICAgICAgICAgICAgICAgcHJpdi5zaG93KGNvbnRyb2wsIHRhcmdldCwgMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzRGlzYWJsZWQgJiYgaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgcHJpdi5oaWRlKGNvbnRyb2wsIHRhcmdldCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyBjb250ZW50XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udHJvbCAtIENvbGxhcHNlIGNvbnRyb2xcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXQgLSBDb2xsYXBzZSB0YXJnZXRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249MzAwXSAtIFRoZSBhbmltYXRpb24gZHVyYXRpb25cclxuICAgICAqL1xyXG4gICAgcHJpdi5zaG93ID0gZnVuY3Rpb24gKGNvbnRyb2wsIHRhcmdldCwgZHVyYXRpb24pIHtcclxuICAgICAgICBpZiAoZHVyYXRpb24gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZHVyYXRpb24gPSAzMDA7XHJcblxyXG4gICAgICAgIHZhciBpc0FjY29yZGlvbiA9ICQoY29udHJvbCkuY2xvc2VzdChcIi5hY2NvcmRpb25cIikubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgY29sbGFwc2VTaWJsaW5nID0gJChjb250cm9sKS5kYXRhKFwiY29sbGFwc2Utc2libGluZ1wiKTtcclxuICAgICAgICB2YXIgZm9jdXNFbGVtZW50ID0gJChjb250cm9sKS5kYXRhKFwiZm9jdXNcIik7XHJcblxyXG4gICAgICAgIGlmIChpc0FjY29yZGlvbikge1xyXG4gICAgICAgICAgICB2YXIgYWNjb3JkaW9uID0gJChjb250cm9sKS5jbG9zZXN0KFwiLmFjY29yZGlvblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZpbmQgYWxsIGNvbGxhcHNlIGNvbnRyb2xzIGluc2lkZSBhY2NvcmRpb24gYW5kIGhpZGUgdGhlbVxyXG4gICAgICAgICAgICAkKGFjY29yZGlvbikuZmluZChcIi5jb2xsYXBzZV9fY29udHJvbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZENvbnRyb2wgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkVGFyZ2V0ID0gJCh0aGlzKS5uZXh0KFwiLmNvbGxhcHNlX190YXJnZXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcHJpdi5oaWRlKGNoaWxkQ29udHJvbCwgY2hpbGRUYXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNob3cgdGhlIGNsaWNrZWQgY29sbGFwc2VcclxuICAgICAgICAkKHRhcmdldCkuc2xpZGVEb3duKGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBhcmlhIHRvIGV4cGFuZGVkXHJcbiAgICAgICAgICAgICQoY29udHJvbCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5hdHRyKFwiYXJpYS1oaWRkZW5cIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGZvY3VzIGlmIGRhdGEgYXR0cmlidXRlIGhhcyBiZWVuIHNldFxyXG4gICAgICAgICAgICBpZiAoZm9jdXNFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgJChmb2N1c0VsZW1lbnQpLmZvY3VzKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgZXhwYW5kZWQgY2xhc3MgdG8gZWxlbWVudHNcclxuICAgICAgICAkKGNvbnRyb2wpLmFkZENsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICAgICAgJCh0YXJnZXQpLmFkZENsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICAgICAgJChjb250cm9sKS5maW5kKFwiLmNvbGxhcHNlX19pY29uXCIpLmFkZENsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcblxyXG4gICAgICAgIC8vIElmIGEgY29sbGFwc2Ugc2libGluZyBpcyBwcmVzZW50LCBhZGQgZXhwYW5kZWQgY2xhc3MgZnJvbSB0aGF0IGFsc29cclxuICAgICAgICBpZiAoY29sbGFwc2VTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgICQoY29udHJvbCkucHJldihjb2xsYXBzZVNpYmxpbmcpLmFkZENsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIaWRlIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250cm9sIC0gQ29sbGFwc2UgY29udHJvbFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldCAtIENvbGxhcHNlIHRhcmdldFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj0zMDBdIC0gVGhlIGFuaW1hdGlvbiBkdXJhdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2LmhpZGUgPSBmdW5jdGlvbiAoY29udHJvbCwgdGFyZ2V0LCBkdXJhdGlvbikge1xyXG4gICAgICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDMwMDtcclxuXHJcbiAgICAgICAgJCh0YXJnZXQpLnNsaWRlVXAoZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gU2V0IGFyaWEgdG8gY29sbGFwc2VkXHJcbiAgICAgICAgICAgICQoY29udHJvbCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKHRhcmdldCkuYXR0cihcImFyaWEtaGlkZGVuXCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGV4cGFuZGVkIGNsYXNzIGZyb20gZWxlbWVudHNcclxuICAgICAgICAgICAgJChjb250cm9sKS5yZW1vdmVDbGFzcyhcImlzLWV4cGFuZGVkIGlzLWFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgJCh0YXJnZXQpLnJlbW92ZUNsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICAgICAgICAgICQoY29udHJvbCkuZmluZChcIi5jb2xsYXBzZV9faWNvblwiKS5yZW1vdmVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbGxhcHNlU2libGluZyA9ICQoY29udHJvbCkuZGF0YShcImNvbGxhcHNlLXNpYmxpbmdcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBhIGNvbGxhcHNlIHNpYmxpbmcgaXMgcHJlc2VudCwgcmVtb3ZlIGV4cGFuZGVkIGNsYXNzIGZyb20gdGhhdCBhbHNvXHJcbiAgICAgICAgICAgIGlmIChjb2xsYXBzZVNpYmxpbmcpIHtcclxuICAgICAgICAgICAgICAgICQoY29udHJvbCkucHJldihjb2xsYXBzZVNpYmxpbmcpLnJlbW92ZUNsYXNzKFwiaXMtZXhwYW5kZWQgaXMtYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGNvbGxhcHNlIGlzIGRpc2FibGVkIGZvciBhIGNvbGxhcHNlIGNvbnRyb2xcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250cm9sIC0gVGhlIGNvbGxhcHNlIGNvbnRyb2xcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBwcml2LmlzRGlzYWJsZWQgPSBmdW5jdGlvbiAoY29udHJvbCkge1xyXG4gICAgICAgIC8vIFdlIHVzZSB0aGUgY3NzIGF0dHJpYnV0ZSBgY29udGVudGAgdG8gcGFzcyBpbmZvcm1hdGlvbiB0byBqYXZhc2NyaXB0XHJcbiAgICAgICAgLy8gYW5kIHRlbGwgdGhlIGNvbGxhcHNlIG1vZHVsZSB0aGF0IHdlIGRvbid0IHdhbnQgY29sbGFwc2UgYmVoYXZpb3VyIG9uXHJcbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgY29udHJvbCBpbiBhIGNlcnRhaW4gYnJlYWtwb2ludC5cclxuICAgICAgICByZXR1cm4gJChjb250cm9sKS5jc3MoXCJjb250ZW50XCIpID09PSBcIlxcXCJkaXNhYmxlLWNvbGxhcHNlXFxcIlwiO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhbiBlbGVtZW50IGlzIGV4cGFuZGVkZWRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gVGhlIGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBwcml2LmlzRXhwYW5kZWQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiAkKGVsZW1lbnQpLmhhc0NsYXNzKFwiaXMtZXhwYW5kZWRcIik7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIHByaXZhdGUgbWV0aG9kc1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNDT09LSUUtQUxFUlRcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TcmMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuYm9yZ2VieSA9IHdpbmRvdy5ib3JnZWJ5IHx8IHt9O1xyXG5ib3JnZWJ5Lm1vZHVsZXMgPSBib3JnZWJ5Lm1vZHVsZXMgfHwge307XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBDb29raWUgYWxlcnQgbW9kdWxlXHJcbiAqL1xyXG5ib3JnZWJ5Lm1vZHVsZXMuY29va2llQWxlcnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgcHJpdi52ZXJpZnlDb29raWVBY2NlcHRhbmNlKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIHByaXYuYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLmpzLWFjY2VwdC1jb29raWVzXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBib3JnZWJ5Lm1vZHVsZXMuY29va2llcy5zZXQoXCJjb29raWVzQWNjZXB0ZWRcIiwgdHJ1ZSwgMzY1KTtcclxuICAgICAgICAgICAgcHJpdi52ZXJpZnlDb29raWVBY2NlcHRhbmNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmeSBjb29raWUgYWNjZXB0YW5jZVxyXG4gICAgICovXHJcbiAgICBwcml2LnZlcmlmeUNvb2tpZUFjY2VwdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGJvcmdlYnkubW9kdWxlcy5jb29raWVzLmdldChcImNvb2tpZXNBY2NlcHRlZFwiKSlcclxuICAgICAgICAgICAgcHJpdi5oaWRlQ29va2llSW5mb3JtYXRpb24oKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHByaXYuc2hvd0Nvb2tpZUluZm9ybWF0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhpZGUgY29va2llIGluZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXYuaGlkZUNvb2tpZUluZm9ybWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKFwiLmNvb2tpZS1pbmZvcm1hdGlvblwiKS5pcyhcIjp2aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgIGJvcmdlYnkubW9kdWxlcy5jb21tb24uaGlkZUNvbnRlbnQoXCIuY29va2llLWluZm9ybWF0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyBjb29raWUgaW5mb3JtYXRpb25cclxuICAgICAqL1xyXG4gICAgcHJpdi5zaG93Q29va2llSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5jb29raWUtaW5mb3JtYXRpb25cIikuc2hvdygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBtb2R1bGVcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuaW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI1BSSU5UXHJcblxcKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLy8gUmVmZXJlbmNlcyBmb3IgaW50ZWxsaXNlbnNlXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIvU3JjL3NjcmlwdHMvX3JlZmVyZW5jZXMuanNcIiAvPlxyXG5cclxuXHJcblxyXG4vLyBOYW1lc3BhY2Vcclxud2luZG93LmJvcmdlYnkgPSB3aW5kb3cuYm9yZ2VieSB8fCB7fTtcclxuYm9yZ2VieS5tb2R1bGVzID0gYm9yZ2VieS5tb2R1bGVzIHx8IHt9O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogUHJpbnQgbW9kdWxlXHJcbiAqL1xyXG5ib3JnZWJ5Lm1vZHVsZXMucHJpbnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5iaW5kRXZlbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIHByaXYuYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLmpzLXByaW50XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB3aW5kb3cucHJpbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgbW9kdWxlXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmluaXQoKTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXFxcclxuICAgICNTSE9XLU1PUkVcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TcmMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuYm9yZ2VieSA9IHdpbmRvdy5ib3JnZWJ5IHx8IHt9O1xyXG5ib3JnZWJ5Lm1vZHVsZXMgPSBib3JnZWJ5Lm1vZHVsZXMgfHwge307XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBNb2R1bGUgZm9yIHNob3dpbmcgbW9yZSAoaGlkZGVuKSBkYXRhXHJcbiAqL1xyXG5ib3JnZWJ5Lm1vZHVsZXMuc2hvd01vcmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWxpemUgYWxsIGxvYWQgbW9yZSdzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChcIi5qcy1zaG93LW1vcmVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRJdGVtcyA9ICQodGhpcykuZGF0YShcInRhcmdldC1pdGVtc1wiKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zVmlzaWJsZSA9ICQodGFyZ2V0KS5kYXRhKFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zVG90YWwgPSAkKHRhcmdldCkuZmluZCh0YXJnZXRJdGVtcykubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIG1vcmUgaXRlbXMgdG8gc2hvd1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNWaXNpYmxlIDwgaXRlbXNUb3RhbCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgaXRlbXNcclxuICAgICAgICAgICAgICAgICQodGFyZ2V0KS5maW5kKHRhcmdldEl0ZW1zKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBpdGVtIHNob3VsZCBiZSBoaWRkZW5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gaXRlbXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJpcy12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaG93IHRyaWdnZXJcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJpcy12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgbG9hZGluZyBtb3JlIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKFwiLmpzLXNob3ctbW9yZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEl0ZW1zID0gJCh0aGlzKS5kYXRhKFwidGFyZ2V0LWl0ZW1zXCIpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXNUb3RhbCA9ICQodGFyZ2V0KS5maW5kKHRhcmdldEl0ZW1zKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBpdGVtc1Zpc2libGUgPSAkKHRhcmdldCkuZGF0YShcInZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RlcCA9ICQodGFyZ2V0KS5kYXRhKFwic3RlcFwiKTtcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgaXRlbXMgdmlzaWJsZSB3aXRoIHN0ZXAgbnVtYmVyXHJcbiAgICAgICAgICAgIGl0ZW1zVmlzaWJsZSA9IHBhcnNlSW50KGl0ZW1zVmlzaWJsZSkgKyBwYXJzZUludChzdGVwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgaXRlbXMgdGhhdCBhcmUgbm90IGFscmVhZHkgdmlzaWJsZVxyXG4gICAgICAgICAgICAkKHRhcmdldCkuZmluZCh0YXJnZXRJdGVtcykubm90KFwiLmlzLXZpc2libGVcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHdlIGhhdmUgc2hvd24gdGhlIG51bWJlciBvZiBuZXcgaXRlbXMgYXMgZGVmaW5lZCBpbiBgc3RlcGAsIHdlIGV4aXQgdGhlIGVhY2ggbG9vcFxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IHN0ZXApXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNob3cgaXRlbVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImlzLXZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29udGludWUgZWFjaCBsb29wXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIHZpc2libGUgY291bnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5kYXRhKFwidmlzaWJsZVwiLCBpdGVtc1Zpc2libGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdHJpZ2dlciBlbGVtZW50IHNob3VsZCBiZSBoaWRkZW5cclxuICAgICAgICAgICAgaWYgKGl0ZW1zVmlzaWJsZSA+PSBpdGVtc1RvdGFsKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaXMtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjVFJVTkNBVEVcclxuXFwqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcblxyXG4vLyBSZWZlcmVuY2VzIGZvciBpbnRlbGxpc2Vuc2VcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi9TcmMvc2NyaXB0cy9fcmVmZXJlbmNlcy5qc1wiIC8+XHJcblxyXG5cclxuXHJcbi8vIE5hbWVzcGFjZVxyXG53aW5kb3cuYm9yZ2VieSA9IHdpbmRvdy5ib3JnZWJ5IHx8IHt9O1xyXG5ib3JnZWJ5Lm1vZHVsZXMgPSBib3JnZWJ5Lm1vZHVsZXMgfHwge307XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBUcnVuY2F0ZSB0ZXh0IG1vZHVsZVxyXG4gKi9cclxuYm9yZ2VieS5tb2R1bGVzLnRydW5jYXRlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcml2ID0ge307XHJcbiAgICB2YXIgcmVzaXplVGltZXI7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJpdmF0ZSBpbml0aWFsaXphdGlvbiBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcHJpdi5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIHByaXYudHJ1bmNhdGUoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHNcclxuICAgICAqL1xyXG4gICAgcHJpdi5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaW5kb3cgcmVzaXplXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcclxuICAgICAgICAgICAgcmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByaXYucmVzaXplKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgYnJvd3NlclxyXG4gICAgICovXHJcbiAgICBwcml2LnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBSZS10cnVuY2F0ZSBvbiB3aW5kb3cgcmVzaXplLiBXaWxsIG9ubHkgdHJ1bmNhdGUgd2hlbiB3aW5kb3cgaXMgcmVzaXplZCBzbWFsbGVyLlxyXG4gICAgICAgIHByaXYudHJ1bmNhdGUoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJ1bmNhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdi50cnVuY2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgJChcIi5qcy10cnVuY2F0ZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRydW5jYXRlID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHRleHRXaWR0aCA9IHRydW5jYXRlLndpZHRoKCk7XHJcbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IHRydW5jYXRlLmNzcyhcImZvbnQtc2l6ZVwiKTtcclxuICAgICAgICAgICAgdmFyIGxldHRlcldpZHRoID0gcGFyc2VJbnQoZm9udFNpemUsIDEwKSAvIDEuODtcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSB0cnVuY2F0ZS5kYXRhKFwicm93c1wiKTtcclxuICAgICAgICAgICAgdmFyIHRydW5jYXRlU2l6ZSA9IE1hdGguZmxvb3IoKHRleHRXaWR0aCAvIGxldHRlcldpZHRoKSAqIHJvd3MpO1xyXG4gICAgICAgICAgICB2YXIgdHJ1bmNhdGVDb250ZW50ID0gdHJ1bmNhdGUuZmluZChcIi5qcy10cnVuY2F0ZS1jb250ZW50XCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdHJ1bmNhdGUgZWxlbWVudCBoYXZlIGNoaWxkIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgdHJ1bmNhdGVkIGluc3RlYWRcclxuICAgICAgICAgICAgaWYgKHRydW5jYXRlQ29udGVudC5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB0cnVuY2F0ZSA9IHRydW5jYXRlQ29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHRydW5jYXRlLnN1Y2NpbmN0KHtcclxuICAgICAgICAgICAgICAgIHNpemU6IHRydW5jYXRlU2l6ZSxcclxuICAgICAgICAgICAgICAgIG9taXNzaW9uOiBcIlxcdTIwMjZcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG1vZHVsZVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5pbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxcXHJcbiAgICAjUkVTUE9OU0lWRS1CRy1JTUFHRVxyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1NyYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5ib3JnZWJ5ID0gd2luZG93LmJvcmdlYnkgfHwge307XHJcbmJvcmdlYnkubW9kdWxlcyA9IGJvcmdlYnkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFJlc3BvbnNpdmUgYmFja2dyb3VuZCBpbWFnZVxyXG4gKi9cclxuYm9yZ2VieS5tb2R1bGVzLnJlc3BvbnNpdmVCZ0ltYWdlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcml2ID0ge307XHJcbiAgICB2YXIgYnJvd3NlcldpZHRoO1xyXG4gICAgdmFyIGNzc0JhY2tncm91bmRJbWFnZTtcclxuICAgIHZhciByZXNpemVUaW1lcjtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG4gICAgICAgIHByaXYuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIHByaXYucmVmcmVzaEJhY2tncm91bmRJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIHByaXYuYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2luZG93IHJlc2l6ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XHJcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHByaXYucmVzaXplKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgYnJvd3NlclxyXG4gICAgICovXHJcbiAgICBwcml2LnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpc0luRWRpdE1vZGUgPSAkKFwiaHRtbFwiKS5oYXNDbGFzcyhcImVkaXQtbW9kZVwiKTtcclxuICAgICAgICB2YXIgbmV3QnJvd3NlcldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhhc1Jlc2l6ZWRIb3Jpem9udGFsbHkgPSBuZXdCcm93c2VyV2lkdGggIT09IGJyb3dzZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiBicm93c2VyIHdpZHRoIGhhc24ndCBjaGFuZ2VkXHJcbiAgICAgICAgaWYgKCFoYXNSZXNpemVkSG9yaXpvbnRhbGx5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIElmIHdpZHRoIGhhcyBjaGFuZ2VkLCB1cGRhdGUgZ2xvYmFsIHZhcmlhYmxlXHJcbiAgICAgICAgYnJvd3NlcldpZHRoID0gbmV3QnJvd3NlcldpZHRoO1xyXG5cclxuICAgICAgICAvLyBJZiBOT1QgaW4gRVBpU2VydmVyIGVkaXQgbW9kZSwgY2hhbmdlIGJhY2tncm91bmQgaW1hZ2VcclxuICAgICAgICBpZiAoIWlzSW5FZGl0TW9kZSlcclxuICAgICAgICAgICAgcHJpdi5yZWZyZXNoQmFja2dyb3VuZEltYWdlKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZnJlc2ggYmFja2dyb3VuZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2LnJlZnJlc2hCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvb3AgdGhyb3VnaCBhbGwgZWxlbWVudHMgd2l0aCByZXNwb25zaXZlIGJhY2tncm91bmQgaW1hZ2UgZnVuY3Rpb25hbGl0eVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoXCIuanMtcmVzcG9uc2l2ZS1iZy1pbWFnZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBpbWFnZSBVUkxzIGZvciBicmVha3BvaW50c1xyXG4gICAgICAgICAgICB2YXIgYmdNb2JpbGUgPSAkKHRoaXMpLmRhdGEoXCJiZy1tb2JpbGVcIik7XHJcbiAgICAgICAgICAgIHZhciBiZ1RhYmxldCA9ICQodGhpcykuZGF0YShcImJnLXRhYmxldFwiKTtcclxuICAgICAgICAgICAgdmFyIGJnRGVza3RvcCA9ICQodGhpcykuZGF0YShcImJnLWRlc2t0b3BcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudCBDU1MgYmFja2dyb3VuZCBpbWFnZVxyXG4gICAgICAgICAgICBjc3NCYWNrZ3JvdW5kSW1hZ2UgPSAkKHRoaXMpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB3aGljaCBiYWNrZ3JvdW5kIGltYWdlIHRoYXQgc2hvdWxkIGJlIHVzZWRcclxuICAgICAgICAgICAgaWYgKGJvcmdlYnkubW9kdWxlcy5icm93c2VyV2lkdGguaXNNb2JpbGUoKSAmJiBiZ01vYmlsZSAhPT0gdW5kZWZpbmVkICYmICFwcml2LmlzQmFja2dyb3VuZEltYWdlU2V0KGJnTW9iaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9iaWxlXHJcbiAgICAgICAgICAgICAgICBwcml2LnNldEJhY2tncm91bmRJbWFnZSh0aGlzLCBiZ01vYmlsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYm9yZ2VieS5tb2R1bGVzLmJyb3dzZXJXaWR0aC5pc1RhYmxldCgpICYmIGJnVGFibGV0ICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdUYWJsZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUYWJsZXRcclxuICAgICAgICAgICAgICAgIHByaXYuc2V0QmFja2dyb3VuZEltYWdlKHRoaXMsIGJnVGFibGV0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIChib3JnZWJ5Lm1vZHVsZXMuYnJvd3NlcldpZHRoLmlzRGVza3RvcCgpICYmIGJnRGVza3RvcCAhPT0gdW5kZWZpbmVkICYmICFwcml2LmlzQmFja2dyb3VuZEltYWdlU2V0KGJnRGVza3RvcCkpIHx8XHJcbiAgICAgICAgICAgICAgICAoYm9yZ2VieS5tb2R1bGVzLmJyb3dzZXJXaWR0aC5pc01vYmlsZSgpICYmIGJnTW9iaWxlID09PSB1bmRlZmluZWQgJiYgYmdEZXNrdG9wICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdEZXNrdG9wKSkgfHxcclxuICAgICAgICAgICAgICAgIChib3JnZWJ5Lm1vZHVsZXMuYnJvd3NlcldpZHRoLmlzVGFibGV0KCkgJiYgYmdUYWJsZXQgPT09IHVuZGVmaW5lZCkgJiYgYmdEZXNrdG9wICE9PSB1bmRlZmluZWQgJiYgIXByaXYuaXNCYWNrZ3JvdW5kSW1hZ2VTZXQoYmdEZXNrdG9wKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGVza3RvcFxyXG4gICAgICAgICAgICAgICAgcHJpdi5zZXRCYWNrZ3JvdW5kSW1hZ2UodGhpcywgYmdEZXNrdG9wKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBDU1MgZm9ybWF0dGVkIGJhY2tncm91bmQgaW1hZ2UgdXJsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmxcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHByaXYuZ2V0QmFja2dyb3VuZEltYWdlVXJsID0gZnVuY3Rpb24gKGltYWdlVXJsKSB7XHJcbiAgICAgICAgdmFyIGNzc1VybCA9IFwidXJsKFwiICsgaW1hZ2VVcmwgKyBcIilcIjtcclxuICAgICAgICByZXR1cm4gY3NzVXJsO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgQ1NTIGJhY2tncm91bmQgaW1hZ2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZVVybFxyXG4gICAgICovXHJcbiAgICBwcml2LnNldEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBpbWFnZVVybCkge1xyXG4gICAgICAgICQoZWxlbWVudCkuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCBwcml2LmdldEJhY2tncm91bmRJbWFnZVVybChpbWFnZVVybCkpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHNldFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHJpdi5pc0JhY2tncm91bmRJbWFnZVNldCA9IGZ1bmN0aW9uIChpbWFnZVVybCkge1xyXG4gICAgICAgIHJldHVybiBjc3NCYWNrZ3JvdW5kSW1hZ2UuaW5kZXhPZihpbWFnZVVybCkgIT09IC0xO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBwcml2YXRlIG1ldGhvZHNcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByaXYuaW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcXFxyXG4gICAgI0RJQUxPR1xyXG5cXCotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuXHJcbi8vIFJlZmVyZW5jZXMgZm9yIGludGVsbGlzZW5zZVxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiL1NyYy9zY3JpcHRzL19yZWZlcmVuY2VzLmpzXCIgLz5cclxuXHJcblxyXG5cclxuLy8gTmFtZXNwYWNlXHJcbndpbmRvdy5ib3JnZWJ5ID0gd2luZG93LmJvcmdlYnkgfHwge307XHJcbmJvcmdlYnkubW9kdWxlcyA9IGJvcmdlYnkubW9kdWxlcyB8fCB7fTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIERpYWxvZyBtb2R1bGVcclxuICovXHJcbmJvcmdlYnkubW9kdWxlcy5kaWFsb2cgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByaXYgPSB7fTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBwcml2LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJpdi5iaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHNcclxuICAgICAqL1xyXG4gICAgcHJpdi5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbGljayBvbiBjb2xsYXBzZSBjb250cm9sXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChcIi5qcy1kaWFsb2dcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ0lkID0gJCh0aGlzKS5kYXRhKFwiZGlhbG9nXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaWFsb2dJZCk7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBuZXcgQTExeURpYWxvZyhkaWFsb2dFbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgbGluayBiZWhhdmlvdXJcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgZGlhbG9nXHJcbiAgICAgICAgICAgIGRpYWxvZy5zaG93KCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgcHJpdmF0ZSBtZXRob2RzXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcml2LmluaXQoKTtcclxuICAgIH0pO1xyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
