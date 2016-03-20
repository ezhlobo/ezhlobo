var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var dirSource = function(path) {
  return '../source/' + path;
};

gulp.task('styles', function() {
  return gulp.src([dirSource('*css'), dirSource('**/*css')])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('../build'))
})

gulp.task('watch', function() {
  gulp.watch(dirSource('**/*css'), ['styles'])
})

gulp.task('default', ['styles', 'watch'])
