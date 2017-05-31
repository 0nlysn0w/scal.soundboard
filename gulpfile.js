'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('compile-sass', function () {
    var plugins = [
        autoprefixer( { browsers: [ 'last 2 versions' ] } ),
        cssnano()    
    ];
    
  return gulp.src(['node_modules/animate.css/animate.css', 'dev/scss/styles.scss'])
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('compile-js', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/materialize-css/dist/js/materialize.js', 'dev/js/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
 
gulp.task('watch', function () {
    gulp.watch('dev/scss/**/*.scss', ['compile-sass']);
    gulp.watch('dev/js/**/*.js', ['compile-js']);
});

gulp.task('default', ['compile-sass', 'compile-js']);