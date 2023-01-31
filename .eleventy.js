const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(src, imgClass, alt, sizes) {
	const inputP = path.dirname(src);
	const relativeinputP = inputP.replace("src/", "");
	const outputP = path.join("_site/", relativeinputP);

	let metadata = await Image(src, {
	  widths: [300, 600],
	  formats: ["avif", "jpeg"],
	  urlPath: "/" + relativeinputP,
	  outputDir: outputP
	});
  
	let imageAttributes = {
	  alt,
	  sizes,
	  class: imgClass,
	  loading: "lazy",
	  decoding: "async",
	};
  
	// You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
	return Image.generateHTML(metadata, imageAttributes);
  }

module.exports = function(eleventyConfig) {
	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addCollection("posts", function(collection) {
		return collection.getFilteredByGlob("src/posts/**/*.md");});
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(pluginWebc, {components: "src/_components/**/*.webc",});
	eleventyConfig.addPlugin(embedYouTube, {modestBranding: true});
	eleventyConfig.addPlugin(metagen);
	eleventyConfig.addPlugin(sitemap, {
		sitemap: {
		  hostname: "https://hyceate.pages.dev",
		},
	  });
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		// Eleventy 1.0+: use this.inputPath and this.outputPath instead
		if (outputPath.endsWith(".html")) {
		  let minified = htmlmin.minify(content, {
			useShortDoctype: false,
			removeComments: true,
			collapseWhitespace: true
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
		return `<div class="video"><div class="aspect-ratio" style="--aspect-ratio: ${aspectRatio}"><iframe class="youtube-player" src="https://youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&modestbranding=1" alt="Youtube Video" frameborder="0" allow="accelerometer;encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;
	  });
	  eleventyConfig.addAsyncShortcode("image", imageShortcode);
	  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
	// watch targets
	eleventyConfig.addWatchTarget("src/static/js/");
	//Passthroughs
	eleventyConfig.addPassthroughCopy("src/static/css");
	eleventyConfig.addPassthroughCopy("src/static/img");
	eleventyConfig.addPassthroughCopy("src/static/js");
	eleventyConfig.addPassthroughCopy("admin");
	eleventyConfig.addPassthroughCopy("src/_redirects", "/");
	eleventyConfig.addPassthroughCopy("src/robots.txt", "/");
	eleventyConfig.addPassthroughCopy("src/_headers.txt", "/");
	eleventyConfig.setDataDeepMerge(true)
	// Let Eleventy transform HTML files 
	// So that we can use .html
	return {
		templateFormats: ["md", "njk", "webc","html","jpg","png","webp"],
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