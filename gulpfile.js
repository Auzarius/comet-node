var gulp 		= require("gulp"),
	babel 		= require("gulp-babel"),
	concat  	= require("gulp-concat"),
	//connect		= require("gulp-connect"),
	cssnano		= require("gulp-cssnano"),
	jshint		= require("gulp-jshint"),
	ngAnnotate  = require("gulp-ng-annotate"),
	plumber		= require("gulp-plumber"),
	rename		= require("gulp-rename"),
	sass		= require("gulp-ruby-sass"),
	sourcemaps  = require("gulp-sourcemaps"),
 	uglify 		= require("gulp-uglify"),
	watch		= require("gulp-watch");
	
var livePort	= 1330;

/*
gulp.task('connect', function() {
	connect.server({
		root: './public/views/',
		port: 1330,
		livereload: true
	});
});
*/

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
		//.pipe(connect.reload());
});

gulp.task('sass', function() {
	return sass(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'])
		.pipe(plumber())
		.pipe(gulp.dest('./public/dev/css'));
		//.pipe(connect.reload());
});

gulp.task('mini-css', function() {
	return gulp.src('./public/dev/css/**/*.css')
		.pipe(plumber())
		.pipe(cssnano())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('./public/dist/css'));
		//.pipe(connect.reload());
});

gulp.task("babel", function () {
	return gulp.src(["**/*.es6", '!./{node_modules,node_modules/**}'])
		.pipe(plumber())
		.pipe(babel())
		.pipe(jshint())
		.pipe(gulp.dest("./public/dist/js/"))
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("./public/dist/js/"));
		//.pipe(connect.reload());
});

gulp.task("watch", function() {
	console.log("Gulp-Watch has begun watching ES6, Angular, CSS and SASS files.\n");
	gulp.watch('./ng-app/**/*.js', ['annotate']);
	gulp.watch(['./public/dev/css/**/*.scss', './public/dev/css/**/*.sass'], ['sass']);
	gulp.watch('./public/dev/css/**/*.css', ['mini-css']);
	gulp.watch(['**/*.es6', '!./{node_modules,node_modules/**}'], ['babel']);
});

gulp.task('default', ['watch']);