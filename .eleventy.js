

const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");

const markdownItAttrs = require('markdown-it-attrs');

const fs = require("fs-extra");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

//const pluginSass = require("eleventy-plugin-sass");

// Markdown packages: https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin&page=1&perPage=20


module.exports = (function(eleventyConfig) {

  // Define Markdown-it lib; allow code indentation by not parsing indention as code elements
  let markdownLibrary = markdownIt({ // docs: https://www.npmjs.com/package/markdown-it
    html: true,
    typographer: true,
  }).disable('code')
  
  // Markdown-it container plugin
  .use( require('markdown-it-container'), '', { // Can add wrapping containers with IDs and Classes, and nest them - docs: https://github.com/markdown-it/markdown-it-container - and some help via: https://ryan.thaut.me/blog/2020/04/25/flirting-with-eleventy-11ty/
    validate: () => true,
    render: (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
            const classList = tokens[idx].info.trim()
            return `<div ${classList && `class="${classList}"`}>`;
        } else {
            return `</div>`;
        }
    }
  })
  .use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{:', // matches kramdown syntax
    rightDelimiter: '}',
    allowedAttributes: []  // empty array = all attributes are allowed
  });


  eleventyConfig.setLibrary("md", markdownLibrary);




  // eleventyConfig.addPlugin(pluginSass, sassPluginOptions);


  // eleventyConfig.addWatchTarget('_site/assets/*.css');

  // eleventyConfig.setBrowserSyncConfig({
  //   files: ['_site/assets/*.css']
  // });

  eleventyConfig.addPassthroughCopy('assets')
  return {
    passthroughFileCopy: true
  }



 // compile sass and optimize it https://www.d-hagemeier.com/en/articles/sass-compile-11ty/ 
 eleventyConfig.on("beforeBuild", () => {
  // Compile Sass
  let result = sass.renderSync({
    file: "_sass/main.scss",
    sourceMap: false,
    outputStyle: "compressed",
  });
  console.log("SCSS compiled");
// Optimize and write file with PostCSS
let css = result.css.toString();
postcss([autoprefixer])
  .process(css, { from: "main.css", to: "css/main.css" })
  .then((result) => {
    fs.outputFile("_site/css/main.css", result.css, (err) => {
      if (err) throw err;
      console.log("CSS optimized");
    });
  });
});

// trigger a rebuild if sass changes
eleventyConfig.addWatchTarget("_sass/");


  


});


