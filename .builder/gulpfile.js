var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var rename = require('gulp-rename');

var locals = {
  stylesheetUrl: 'build/main.css'
};

var dirSource = function(path) {
  return '../source/' + path;
};

gulp.task('styles', function() {
  return gulp.src([dirSource('*css'), dirSource('**/*css')])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('../build'))
})

gulp.task('views', function() {
  return gulp.src(dirSource('jade'))
    .pipe(rename('index'))
    .pipe(jade({
      locals: locals
    }).on('error', console.log))
    .pipe(gulp.dest('..'))
})

gulp.task('watch', function() {
  gulp.watch(dirSource('**/*css'), ['styles'])
  gulp.watch(dirSource('**/jade'), ['views'])
})

gulp.task('default', ['styles', 'views', 'watch'])
