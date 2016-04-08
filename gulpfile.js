"use strict";

var gulp = require("gulp"),
	babel = require("gulp-babel"),
	concat = require("gulp-concat"),
	connect		= require("gulp-connect"),
	cssbeautify = require("gulp-cssbeautify"),
	cssnano = require("gulp-cssnano"),
	jshint = require("gulp-jshint"),
	ngAnnotate = require("gulp-ng-annotate"),
	plumber = require("gulp-plumber"),
	rename = require("gulp-rename"),
	sass = require("gulp-ruby-sass"),
	sourcemaps = require("gulp-sourcemaps"),
	uglify = require("gulp-uglify"),
	watch = require("gulp-watch");

var livePort	= 8080,
	cssconfig = {
		indent: '\t',
		openbrace: 'seperate-line',
		autosemicolor: true
	};

console.log("Starting gulp server...");

gulp.task('connect', function() {
	connect.server({
		root: './public',
		port: livePort,
		livereload: true,
		fallback: './public/views/index.html'
	});
});

gulp.task('annotate', function() {
	return gulp.src('./ng-app/**/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(ngAnnotate())
		.pipe(concat('comet.node.js'))
		.pipe(gulp.dest('./public/dist/js/'))
		.pipe(uglify())
		.pipe(rename({ extname: ".min.js" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('sass', function() {
	return sass(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'])
		.pipe(plumber())
		.pipe(cssbeautify(cssconfig))
		.pipe(gulp.dest('./public/dev/css'));
});

gulp.task('mini-css', function() {
	return gulp.src('./public/dev/css/**/*.css')
		.pipe(plumber())
		.pipe(cssbeautify(cssconfig))
		.pipe(sourcemaps.init())
		.pipe(gulp.dest('./public/dist/css'))
		.pipe(cssnano())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('./public/dist/css'));
});

gulp.task("babel", function() {
	return gulp.src(["**/*.babel.js", '!./{node_modules,node_modules/**}'])
		.pipe(plumber())
		.pipe(babel())
		.pipe(jshint())
		.pipe(gulp.dest("./public/dist/js/"))
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("./public/dist/js/"));
});

gulp.task("watch", function() {
	gulp.watch('./ng-app/**/*.js', ['annotate']);
	gulp.watch(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'], ['sass', 'mini-css']);
	gulp.watch('./public/dev/css/**/*.css', ['mini-css']);
	gulp.watch(['**/*.es6', '!./{node_modules,node_modules/**}'], ['babel']);
	console.log("Gulp-Watch has begun watching ES6, Angular, CSS and SASS files.");
});

gulp.task('default', ['watch', 'connect']);