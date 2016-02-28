"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import concat from "gulp-concat";
import cssnano from "gulp-cssnano";
import jshint from "gulp-jshint";
import ngAnnotate from "gulp-ng-annotate";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sass from "gulp-ruby-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import watch from "gulp-watch";

let livePort	= 1330;

gulp.task('annotate', () => {
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

gulp.task('sass', () => {
	return sass(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'])
		.pipe(plumber())
		.pipe(gulp.dest('./public/dev/css'));
});

gulp.task('mini-css', () => {
	return gulp.src('./public/dev/css/**/*.css')
		.pipe(plumber())
		.pipe(cssnano())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('./public/dist/css'));
});

gulp.task("babel", () => {
	return gulp.src(["**/*.babel.js", '!./{node_modules,node_modules/**}'])
		.pipe(plumber())
		.pipe(babel())
		.pipe(jshint())
		.pipe(gulp.dest("./public/dist/js/"))
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("./public/dist/js/"));
});

gulp.task("watch", () => {
	console.log("Gulp-Watch has begun watching ES6, Angular, CSS and SASS files.");
	gulp.watch('./ng-app/**/*.js', ['annotate']);
	gulp.watch(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'], ['sass']);
	gulp.watch('./public/dev/css/**/*.css', ['mini-css']);
	gulp.watch(['**/*.es6', '!./{node_modules,node_modules/**}'], ['babel']);
});

gulp.task('default', ['watch']);