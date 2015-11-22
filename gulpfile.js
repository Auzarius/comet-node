var gulp 		= require('gulp'),
	concat  	= require('gulp-concat'),
	sourcemaps  = require('gulp-sourcemaps'),
 	uglify 		= require('gulp-uglify'),
	minifyCss 	= require('gulp-minify-css'),
	babel 		= require("gulp-babel");

gulp.task('annotate', function() {
	return gulp.src('./ng-app/annotated/*.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('./public/assets/includes/'));
});

gulp.task('minify-css', function() {
	return gulp.src('./public/assets/css/*.css')
		.pipe(minifyCss())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('./public/assets/includes/'));
});

/*
gulp.task("babel", function () {
  return gulp.src("comet-node/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/assets/includes/"));
});
*/
gulp.task('default', ['annotate', 'minify-css']);