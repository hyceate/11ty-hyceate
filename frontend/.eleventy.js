const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const metagen = require('eleventy-plugin-metagen');

module.exports = function(eleventyConfig) {
	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addCollection("posts", function(collection) {
		return collection.getFilteredByGlob("src/posts/**/*.md");});
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(pluginWebc, {components: "src/_components/**/*.webc",});
	eleventyConfig.addPlugin(embedYouTube, {
		modestBranding: true
		});
	eleventyConfig.addPlugin(metagen);
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		// Eleventy 1.0+: use this.inputPath and this.outputPath instead
		if (outputPath.endsWith(".html")) {
		  let minified = htmlmin.minify(content, {
			useShortDoctype: false,
			removeComments: true,
			collapseWhitespace: false
		  });
		  return minified;}
		return content;});
	// Minify CSS
	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	  });
	eleventyConfig.addFilter("jsmin", function(code) {
	let minified = UglifyJS.minify(code);
	if (minified.error) {
		console.log("UglifyJS error: ", minified.error);
		return code;
	}
	return minified.code;
	});
	//Shortcodes
	eleventyConfig.addNunjucksShortcode("youtube", function (youtubeUrl, aspectRatio) {
		function getVideoId(id) {
		  if (id.includes('watch?v=')) {return id.split('watch?v=')[1];} 
		  else if (id.includes('youtu.be/')) {return id.split('youtu.be/')[1];} else if (id.includes('embed/')) {return id.split('embed/')[1];} 
		  else {return '';}}
		const videoId = getVideoId(youtubeUrl);
		return `<div class="test"><div class="aspect-ratio" style="--aspect-ratio: ${aspectRatio}"><iframe class="youtube-player" src="https://youtube.com/embed/${videoId}?autoplay=1&mute=1" alt="Youtube Video" frameborder="0" allow="accelerometer;encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;
	  });
	//Passthroughs
	eleventyConfig.addPassthroughCopy("src/static");
	eleventyConfig.addPassthroughCopy("admin");
	// Let Eleventy transform HTML files 
	// So that we can use .html
	return {
		templateFormats: ["md", "njk", "webc","html","jpg"],
		pathPrefix: "/",
		dir: {
			input: "src",
			assets: "src/assets",
			output: "_site"
		},
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
	};
};