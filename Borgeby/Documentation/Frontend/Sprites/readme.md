# Sprites
This file contains developer instructions on how to create and use sprite images in this project.

Author: [Viktor Wissing](mailto:viktor.wissing@cgi.com)

## Icon files
For every icon, there should be two files. One for normal screens and one for retina. The filenames should follow this convention:

Normal file: `search.png`<br />
Retina file: `search@2x.png`

## Bundling
In `gulpfile.js`, we define the path for the icons that should be included in the sprites. The bundling is then performed by Gulp, which will create the following three files:

`/Dist/assets/images/sprite.png`<br />
`/Dist/assets/images/sprite@2x.png`<br />
`/Src/Styles/2_tools/_tools.sprites.scss`

If the build server where the website should be deployed supports Gulp, the destination files should not be included in the project. If the webserver lacks support for Gulp, the destination files needs to be included in the project.

## Using sprites in CSS
To use the icons in the stylesheets, simply call the retina mixin like this:

`@include retina-sprite($icon-search-group);`

This will automatically serve the correct icon depending on the screens pixel density.
