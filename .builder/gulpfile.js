var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var del = require('del');
var md5 = require('gulp-md5-plus');
var ghPages = require('gulp-gh-pages');

var assetUrl = function(name) {
  return name;
};

var locals = {
  assetUrl: assetUrl,
  stylesheetUrl: assetUrl('main.css'),
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  tagsItemWrapper: function(name, info) {
    return '<span class="tags__item"><em>' + name + '</em>' + (info ? ' <span>(' + info + ')</span>' : '') + '</span>';
  },
};

var dirSource = function(path) {
  return '../source/' + path;
};

gulp.task('clean', function() {
  return del.sync(['../build', './.publish'], {
    force: true
  });
})

gulp.task('styles', function() {
  return gulp.src([dirSource('*css'), dirSource('**/*css')])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('../build'))
})

gulp.task('views', function() {
  return gulp.src(dirSource('.jade'))
    .pipe(rename('index'))
    .pipe(jade({
      locals: locals
    }).on('error', console.log))
    .pipe(gulp.dest('../build'))
})

gulp.task('images', function() {
  return gulp.src(dirSource('**/*.png'))
    .pipe(gulp.dest('../build'))
})

gulp.task('assets', function() {
  return gulp.src(['../build/**/*.css', '../build/**/*.png', '../build/**/*.jpg'])
    .pipe(md5(6, '../build/index.html'))
    .pipe(gulp.dest('../build'))
})

gulp.task('deploy', function() {
  return gulp.src(['../build/**'])
    .pipe(ghPages({
      force: true
    }))
})

// Necessary for `watch` function
gulp.task('watch', function() {
  watch(dirSource('**/*css'), function() {
    gulp.start(['styles'])
  })

  watch(dirSource('**/*jade'), function() {
    gulp.start(['views'])
  })

  watch(dirSource('**/*.(png|jpg|svg)'), function() {
    gulp.start(['images'])
  })
})

gulp.task('default', ['styles', 'views', 'images', 'watch'])

gulp.task('build', ['clean', 'styles', 'images', 'views'])
