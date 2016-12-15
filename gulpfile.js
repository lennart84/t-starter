// Include Gulp
var gulp = require('gulp');

// Include Plugins
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var plumber      = require('gulp-plumber');
var gulpUtil     = require('gulp-util');
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();

// make noise on js and scss errors
function errorHandler(error) {
    gulpUtil.beep();
    return true;
}

// Lint JS-Files
gulp.task('lint', function() {
    return gulp
        .src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp
        .src('js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest(''));
});

// Compile Sass
gulp.task('sass', function() {
    return gulp
        .src('scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber(errorHandler))
        .pipe(sass({
            outputStyle: 'expanded',
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(plumber.stop())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(''))
        .pipe(browserSync.stream());
});

// Watch Files For Changes
gulp.task('watch', function() {
    browserSync.init({
      proxy: 'localhost/0-lennart/testumgebung/'
    });
    gulp.watch('js/*.js', ['lint', 'scripts']).on('change', browserSync.reload);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

// Default Tasks
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
