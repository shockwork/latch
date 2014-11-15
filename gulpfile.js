var format = require("util").format;


//
// Gulp modules
// 
var gulp = require("gulp");
var webpack = require("gulp-webpack");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rimraf = require("gulp-rimraf");
var docco = require("gulp-docco");

var pkg = require("./package.json");

gulp.task("clean:dist", function () {

	return rimraf("./dist")

});

gulp.task("docs", function () {
	return gulp.src("./src/*.js")
  		.pipe(docco())
  		.pipe(gulp.dest('./docs'))
});

gulp.task("dist", function () {

	gulp.start("clean:dist");
	return gulp.src("./src/latch.js")
		.pipe(webpack({
		    output: {		        
		        libraryTarget: "var",		        
		        library: "latch",
		        filename: format("latch-%s.js", pkg.version)
		    }
		}))
		.pipe(gulp.dest("dist/"))
		.pipe(uglify())
		.pipe(rename(format("latch-%s.min.js", pkg.version)))
		.pipe(gulp.dest("dist/"));

});