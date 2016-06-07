/// <binding ProjectOpened='watch' />


// URLs to all plugins
// concat           https://github.com/contra/gulp-concat
// cssnano          https://github.com/ben-eb/gulp-cssnano
// gzip             https://github.com/jstuckey/gulp-gzip
// imagemin         https://github.com/sindresorhus/gulp-imagemin
// jsvalidate       https://github.com/sindresorhus/gulp-jsvalidate
// load-plugins     https://github.com/jackfranklin/gulp-load-plugins
// mergestream      https://github.com/grncdr/merge-stream
// modernizr        https://github.com/doctyper/gulp-modernizr
// plumber          https://github.com/floatdrop/gulp-plumber
// postcss          https://github.com/postcss/gulp-postcss
// postcss-scss     https://github.com/postcss/postcss-scss
// rename           https://github.com/hparra/gulp-rename
// sass             https://github.com/dlmanning/gulp-sass
// sassdoc          http://sassdoc.com/gulp/
// size             https://github.com/sindresorhus/gulp-size
// sourcemaps       https://github.com/floridoo/gulp-sourcemaps
// spritesmith      https://github.com/twolfson/gulp.spritesmith
// stylelint        https://github.com/stylelint/stylelint
// uglify           https://github.com/terinjokes/gulp-uglify
// util             https://github.com/gulpjs/gulp-util
// vinylbuffer      https://github.com/hughsk/vinyl-buffer



// Lazy load all plugins that are defines in packages.json
// To call a plugin, prefix the name with `plugins.`
var plugins = require("gulp-load-plugins")({
    pattern: [
        "*",
        "gulp-*",
        "gulp.*",
        "postcss-*"
    ]
});



// Base path for frontend files
var basePath = "./Src/";

// Base destination path for frontend files
var baseDestinationPath = "./Dist/assets/";

// Specific paths for each frontend part
var paths = {

    // Styles
    styles: {
        // Source folder for scss files
        src: basePath + "styles/",
        // Destination folder for the bundled and minified css files
        dist: baseDestinationPath + "styles/",
        // Destination folder for sassdoc documentation
        docs: "./Documentation/Frontend/Styles/Sassdoc/",
    },

    // Scripts
    scripts: {
        // Source folder for javascript modules
        src: basePath + "scripts/modules/",
        // Source folder for vendor javascripts
        vendor: baseDestinationPath + "scripts/vendor/",
        // Destination folder for the bundled and minified js files
        dist: baseDestinationPath + "scripts/",
    },

    // Sprites
    sprites: {
        // Source folder for icon files
        src: basePath + "images/icons/",
        // Destination folder for the sprite images
        dist: baseDestinationPath + "images/",
        // Destination folder for the scss mixin file
        distCss: basePath + "styles/2_tools/",
    }
};



// Linter for our scss files
plugins.gulp.task("stylelint", function () {

    // Task specific configuration
    var config = {

        // Source files to include when linting
        srcFile: [

            // Include all scss files
            paths.styles.src + "**/*.scss",

            // Exclude sprite mixin since the code is auto generated
            "!" + paths.styles.src + "2_tools/_tools.sprites.scss"
        ]
    };

    // Stylelint config rules
    var stylelintConfig = {
        "rules": {
            "at-rule-empty-line-before": ["always", {
                except: ["blockless-group"],
                ignore: ["after-comment", "all-nested"],
            }],
            "at-rule-name-case": "lower",
            "at-rule-name-space-after": "always-single-line",
            "at-rule-semicolon-newline-after": "always",
            "block-closing-brace-newline-after": "always",
            "block-closing-brace-newline-before": "always-multi-line",
            "block-closing-brace-space-before": "always-single-line",
            "block-no-empty": true,
            "block-opening-brace-newline-after": "always-multi-line",
            "block-opening-brace-space-after": "always-single-line",
            "block-opening-brace-space-before": "always",
            "color-hex-case": "lower",
            "color-hex-length": "short",
            "color-no-invalid-hex": true,
            "comment-empty-line-before": ["always", {
                except: ["first-nested"],
                ignore: ["stylelint-commands"],
            }],
            "comment-whitespace-inside": "always",
            "declaration-bang-space-after": "never",
            "declaration-bang-space-before": "always",
            "declaration-block-no-ignored-properties": true,
            "declaration-block-no-shorthand-property-overrides": true,
            "declaration-block-properties-order": [
                {
                    // Complete list of css properties: http://www.w3schools.com/cssref/

                    // Positioning
                    order: "flexible",
                    properties: [
                        "bottom",
                        "clear",
                        "float",
                        "left",
                        "position",
                        "right",
                        "top",
                        "z-index",
                    ],
                },
                {
                    // Display & Box-model
                    order: "flexible",
                    properties: [
                        "box-sizing",
                        "display",
                        "height",
                        "margin",
                        "max",
                        "min",
                        "overflow",
                        "padding",
                        "width",
                    ],
                },
                {
                    // Text
                    order: "flexible",
                    properties: [
                        "color",
                        "direction",
                        "font",
                        "hanging-punctuation",
                        "letter-spacing",
                        "line-height",
                        "tab-size",
                        "text",
                        "unicode-bidi",
                        "white-space",
                        "word",
                    ],
                },
                {
                    // Visual
                    order: "flexible",
                    properties: [
                        "animation",
                        "backface-visibility",
                        "background",
                        "border",
                        "box-shadow",
                        "clip",
                        "filter",
                        "opacity",
                        "outline",
                        "perspective",
                        "transform",
                        "transition",
                        "visilibity",
                    ],
                },
                {
                    // Misc
                    order: "flexible",
                    properties: [
                        "align",
                        "all",
                        "caption-side",
                        "column",
                        "columns",
                        "content",
                        "counter",
                        "cursor",
                        "empty-cells",
                        "flex",
                        "justify",
                        "list-style",
                        "nav",
                        "order",
                        "page-break",
                        "quotes",
                        "resize",
                        "table-layout",
                        "vertical-align",
                    ],
                },
            ],
            "declaration-block-semicolon-newline-after": "always-multi-line",
            "declaration-block-semicolon-space-after": "always-single-line",
            "declaration-block-semicolon-space-before": "never",
            "declaration-block-single-line-max-declarations": 1,
            "declaration-block-trailing-semicolon": "always",
            "declaration-colon-newline-after": "always-multi-line",
            "declaration-colon-space-after": "always-single-line",
            "declaration-colon-space-before": "never",
            "function-calc-no-unspaced-operator": true,
            "function-comma-newline-after": "always-multi-line",
            "function-comma-space-after": "always-single-line",
            "function-comma-space-before": "never",
            "function-linear-gradient-no-nonstandard-direction": true,
            "function-max-empty-lines": 0,
            "function-name-case": "lower",
            "function-parentheses-newline-inside": "always-multi-line",
            "function-parentheses-space-inside": "never-single-line",
            "function-whitespace-after": "always",
            "indentation": 4,
            "max-empty-lines": 3,
            "media-feature-colon-space-after": "always",
            "media-feature-colon-space-before": "never",
            "media-feature-no-missing-punctuation": true,
            "media-feature-range-operator-space-after": "always",
            "media-feature-range-operator-space-before": "always",
            "media-query-list-comma-newline-after": "always-multi-line",
            "media-query-list-comma-space-after": "always-single-line",
            "media-query-list-comma-space-before": "never",
            "media-query-parentheses-space-inside": "never",
            "no-eol-whitespace": true,
            "no-extra-semicolons": true,
            "no-invalid-double-slash-comments": true,
            "no-missing-eof-newline": true,
            "number-leading-zero": "never",
            "number-no-trailing-zeros": true,
            "number-zero-length-no-unit": true,
            "property-case": "lower",
            "rule-non-nested-empty-line-before": ["always-multi-line", {
                ignore: ["after-comment"],
            }],
            "selector-attribute-brackets-space-inside": "never",
            "selector-attribute-operator-space-after": "never",
            "selector-attribute-operator-space-before": "never",
            "selector-combinator-space-after": "always",
            "selector-combinator-space-before": "always",
            "selector-list-comma-newline-after": "always",
            "selector-list-comma-space-before": "never",
            "selector-max-empty-lines": 0,
            "selector-pseudo-class-case": "lower",
            "selector-pseudo-class-parentheses-space-inside": "never",
            "selector-pseudo-element-case": "lower",
            "selector-pseudo-element-colon-notation": "double",
            "selector-pseudo-element-no-unknown": true,
            "selector-type-case": "lower",
            "shorthand-property-no-redundant-values": true,
            "string-no-newline": true,
            "unit-case": "lower",
            "unit-no-unknown": true,
            "value-list-comma-newline-after": "always-multi-line",
            "value-list-comma-space-after": "always-single-line",
            "value-list-comma-space-before": "never",
        },
    }

    // PostCSS plugins
    var postCssPlugins = [

        // Stylelint configuration
        plugins.stylelint(stylelintConfig),

        // PostCSS reporter configuration
        plugins.postcssReporter({
            clearMessages: true,
            throwError: true
        })
    ];

    // Task stream
    return plugins.gulp.src(config.srcFile)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Run postcss plugins
        .pipe(plugins.postcss(postCssPlugins, {
            syntax: plugins.postcssScss
        }));
});



// Sassdoc documentation
plugins.gulp.task("sassdoc", function () {

    // Task specific configuration
    var config = {

        // Source folder to include in the documentation
        srcFile: "**/*.scss",
    };

    // Sassdoc config rules
    var sassdocConfig = {

        // Destination folder for the documentation
        dest: paths.styles.docs
    }

    // Task stream
    return plugins.gulp.src(paths.styles.src + config.srcFile)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Generate documentation
        .pipe(plugins.sassdoc(sassdocConfig));
});



// Styles
// Requires that `stylelint` and `sassdoc` have been completed
plugins.gulp.task("styles", ["stylelint"], function () {

    // Task specific configuration
    var config = {

        // Source file that imports all scss files
        srcFile: "styles.scss",

        // Destination css file
        distFileName: "styles.css",

        // Suffix for minified css file
        distFileSuffix: ".min",

        // Define postcss plugins
        postCssPlugins: [

            // Auto prefix browser specific css classes
            plugins.autoprefixer
        ]
    };

    // Task stream
    return plugins.gulp.src(paths.styles.src + config.srcFile)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Initialize source maps
        .pipe(plugins.sourcemaps.init())

        // Compile sass file
        .pipe(plugins.sass().on("error", plugins.sass.logError))

        // Write source maps
        .pipe(plugins.sourcemaps.write())

        // Run postcss plugins
        .pipe(plugins.postcss(config.postCssPlugins))

        // Show uncompressed file size
		.pipe(plugins.size({
		    title: "Original file size: "
		}))

        // Rename file to *.css
		.pipe(plugins.rename(config.distFileName))

    // Save css file
	.pipe(plugins.gulp.dest(paths.styles.dist))

        // Minify css file
		.pipe(plugins.cssnano())

        // Rename file to *.min.css
		.pipe(plugins.rename({
		    suffix: config.distFileSuffix
		}))

        // Show minified file size
		.pipe(plugins.size({
		    title: "Minified file size: "
		}))

    // Save minified css file
	.pipe(plugins.gulp.dest(paths.styles.dist))

        // Gzip file
        .pipe(plugins.gzip())

        // Show gzipped file size
        .pipe(plugins.size({
            title: "Gzipped file size: "
        }));
});



// Modernizr
// Scans our javascript files and builds a custom modernizr file
plugins.gulp.task("modernizr", function () {

    // Task specific configuration
    var config = {

        // Source files to scan for modernizr method calls
        srcFiles: [
			paths.scripts.dist + "scripts.js"
        ]
    };

    // Task stream
    return plugins.gulp.src(config.srcFiles)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Validate files for errors
		.pipe(plugins.jsvalidate())

        // Create modernizr build
        .pipe(plugins.modernizr({
            // Destination file
            dest: paths.scripts.vendor + "modernizr-custom.js"
        }));
});



// Scripts
plugins.gulp.task("scripts", function () {

    // Task specific configuration
    var config = {

        // Source files that should be included. Must be specified explicitly since order matters.
        srcFiles: [
			paths.scripts.vendor + "modernizr-custom.js",
            paths.scripts.vendor + "jQuery.succinct.js",
            paths.scripts.src + "common.js",
            paths.scripts.src + "cookies.js",
            paths.scripts.src + "session-storage.js",
            paths.scripts.src + "browser-width.js",
            paths.scripts.src + "polyfills.js",
            paths.scripts.src + "collapse.js",
            paths.scripts.src + "cookie-alert.js",
            paths.scripts.src + "print.js",
            paths.scripts.src + "show-more.js",
            paths.scripts.src + "truncate.js",
            paths.scripts.src + "responsive-bg-image.js",
            paths.scripts.src + "dialog.js",
        ],

        // Destination js file
        distFileName: "scripts.js",

        // Suffix for minified js file
        distFileSuffix: ".min"
    };

    // Task stream
    return plugins.gulp.src(config.srcFiles)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Validate files for errors
		.pipe(plugins.jsvalidate())

        // Initialize source maps
        .pipe(plugins.sourcemaps.init())

        // Concatenate all script files
		.pipe(plugins.concat(config.distFileName))

        // Write source maps
        .pipe(plugins.sourcemaps.write())

        // Show original file size
		.pipe(plugins.size({
		    title: "Original file size: "
		}))

    // Save uncompressed file
	.pipe(plugins.gulp.dest(paths.scripts.dist))

        // Minify js files
		.pipe(plugins.uglify())

        // Show minified file size
		.pipe(plugins.size({ title: "Minified file size: " }))

        // Rename file to min.js
		.pipe(plugins.rename({
		    suffix: config.distFileSuffix
		}))

    // Save minified js file
	.pipe(plugins.gulp.dest(paths.scripts.dist))

        // Gzip file
        .pipe(plugins.gzip())

        // Show gzipped file size
        .pipe(plugins.size({
            title: "Gzipped file size: "
        }));
});



// Sprites
plugins.gulp.task("sprites", function () {

    // Task specific configuration
    var config = {

        // Source file format to include
        srcFileFormat: "*.png",

        // Retina identifier in filenames
        srcRetinaFilter: "*@2x.png",

        // Destination file name of sprite for normal screens
        distNormalImage: "sprite.png",

        // Destination file name of sprite for retina screens
        distRetinaImage: "sprite@2x.png",

        // Destination file name of scss mixins
        distCss: "_tools.sprites.scss",

        // CSS variable prefix (optional)
        distCssVarPrefix: "",

        // CSS format
        cssFormat: "scss_retina",

        // URL to background images as they should appear in the destination css
        cssBackground: "/Static/images/icons/dist/"
    };

    // Task stream
    var stream = plugins.gulp.src(paths.sprites.src + config.srcFileFormat)

        // Handle errors
		.pipe(plugins.plumber({
		    errorHandler: handleError
		}))

        // Generate sprites
        .pipe(plugins.spritesmith({
            imgName: config.distNormalImage,
            imgPath: config.cssBackground + config.distNormalImage,
            retinaImgName: config.distRetinaImage,
            retinaImgPath: config.cssBackground + config.distRetinaImage,
            retinaSrcFilter: [paths.sprites.src + config.srcRetinaFilter],
            cssName: config.distCss,
            cssFormat: config.cssFormat,
            cssVarMap: function (sprite) {
                sprite.name = config.distCssVarPrefix + sprite.name;
            }
        }));

    // CSS stream
    var cssStream = stream.css

        // Handle errors
        .pipe(plugins.plumber({
            errorHandler: handleError
        }))

    // Save css file
    .pipe(plugins.gulp.dest(paths.sprites.distCss));

    // Image stream
    var imgStream = stream.img

        // Handle errors
        .pipe(plugins.plumber({
            errorHandler: handleError
        }))

        // Convert stream vinyl to use buffer
        .pipe(plugins.vinylBuffer())

        // Optimize image
        .pipe(plugins.imagemin())

    // Save sprite images
    .pipe(plugins.gulp.dest(paths.sprites.dist));

    // Merge css and image stream
    return plugins.mergeStream(imgStream, cssStream);
});



// Watch for new/changed/deleted files
plugins.gulp.task("watch", function () {

    // Task specific configuration
    var config = {

        // Scss files to watch
        includeCss: "**/*.scss",

        // Js files to watch
        includeJs: "**/*.js"
    }

    // Watch for changes in styles
    plugins.gulp.watch(paths.styles.src + config.includeCss, ["styles"]);

    // Watch for changes in scripts
    plugins.gulp.watch(paths.scripts.src + config.includeJs, ["scripts"]);
});



// Default task
plugins.gulp.task("default", ["styles", "scripts", "sprites"]);



// Error handling function
var handleError = function (err) {

    // Show error messages
    plugins.util.log(err);

    // Prevent task to quit
    this.emit("end");
};
