var gulp 		= require('gulp'),
	babel 		= require("gulp-babel"),
	concat  	= require('gulp-concat'),
	cssnano		= require("gulp-cssnano"),
	ngAnnotate  = require("gulp-ng-annotate"),
	plumber		= require("gulp-plumber"),
	rename		= require("gulp-rename"),
	sass		= require("gulp-ruby-sass"),
	sourcemaps  = require('gulp-sourcemaps'),
 	uglify 		= require('gulp-uglify'),
	watch		= require("gulp-watch");
	
gulp.task('annotate', function() {
	return gulp.src('./ng-app/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(plumber())
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
		.on('error', sass.logError)
		.pipe(gulp.dest('./public/dev/css'));
})

gulp.task('mini-css', function() {
	return gulp.src('./public/dev/css/**/*.css')
		.pipe(cssnano())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('./public/dist/css'));
})

gulp.task("babel", function () {
	return gulp.src(["**/*.es6", '!./{node_modules,node_modules/**}'])
		.pipe(babel())
		.pipe(gulp.dest("./public/dist/js/"))
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("./public/dist/js/"));
});

gulp.task('default', ['annotate', 'babel', 'sass', 'mini-css']);