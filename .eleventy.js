const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const markdownItAttrs = require('markdown-it-attrs');
const fs = require("fs-extra");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = (function(eleventyConfig) {

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Define Markdown-it lib; allow code indentation by not parsing indention as code elements
  let markdownLibrary = markdownIt({
    html: true,
    typographer: true,
  }).disable('code')
  
  // Markdown-it container plugin
  .use( require('markdown-it-container'), '', {
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

  eleventyConfig.addPassthroughCopy('assets')
  return {
    passthroughFileCopy: true
  }

  eleventyConfig.setServerOptions({
    // Default values are shown:

    // Opt-out of the live reload snippet
    enabled: true,

    // Opt-out of DOM diffing updates and use page reloads
    domdiff: true,

    // The starting port number to attempt to use
    port: 8080,

    // number of times to increment the port if in use
    portReassignmentRetryCount: 10,

    // Show local network IP addresses for device testing
    showAllHosts: false,

    // Use a local key/certificate to opt-in to local HTTP/2 with https
    https: {
      // key: "./localhost.key",
      // cert: "./localhost.cert",
    },

    // Change the name of the special folder name used for injected scripts
    folder: ".11ty",

    // Show the server version number on the command line
    showVersion: false,

    // Change the default file encoding for reading/serving files
    encoding: "utf-8",
  });
});
