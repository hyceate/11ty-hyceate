const yaml = require("js-yaml");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const htmlmin = require("html-minifier");


module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("admin");
	eleventyConfig.addPassthroughCopy("src/static");
	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(pluginWebc, {
		// Glob to find no-import global components
		// (The default changed from `false` in Eleventy WebC v0.7.0)
		components: "src/_components/**/*.webc",
		// Adds an Eleventy WebC transform to process all HTML output
		useTransform: false,
		// Additional global data used in the Eleventy WebC transform
		transformData: {},
	});
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		// Eleventy 1.0+: use this.inputPath and this.outputPath instead
		if (outputPath.endsWith(".html")) {
		  let minified = htmlmin.minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: false,
		  });
		  return minified;
		}
	
		return content;
	  });
	eleventyConfig.addNunjucksShortcode("youtube", function (youtubeId, aspectRatio) {
		return `<div class="aspect-ratio" style="--aspect-ratio: ${aspectRatio}"><iframe class="youtube-player video video--youtube" src="https://www.youtube.com/embed/${youtubeId}/" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
	  });
    // Let Eleventy transform HTML files 
  // So that we can use .html
  return {
	dir: {
		input: "src"
	},
	markdownTemplateEngine: "njk",
	dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};