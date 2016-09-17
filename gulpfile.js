const path = require('path');
const gulp = require('gulp');
const keva = require('keva');
const decb = require('decb');
const fs = decb(require('fs'), {
  use: ['readFile', 'writeFile']
});
const postcss = require('gulp-postcss');
const connect = require('gulp-connect');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const posthtml = require('gulp-posthtml');
const watch = {
  css: 'src/style/**/*.css',
  html: 'src/markup/**/*.hbs'
}

gulp.task('html', function () {
  let templateData = {
    page: [
      'P1', 'P2'
    ]
  };


  let bemData = {
        elemPrefix: '__',
        modPrefix: '--',
        modDlmtr: '_'
    };

  return gulp.src(watch.html)
    .pipe(posthtml([
          require('posthtml-bem')(bemData)
    ]))
    .pipe(handlebars(templateData))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('css', () => {
    return gulp.src('src/style/main.css')
        .pipe(postcss([
          require('postcss-cssnext')
        ]))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('connect', () => {
  connect.server({
    port: 8080,
    root: 'build',
    livereload: true
  });
});

gulp.task('watch', () => {
  for (let [key, val] of keva(watch)) {
    gulp.watch(val, [key]);
  }
});

gulp.task('dev', ['connect'], () => {
  gulp.start('css', 'html', 'watch');
});
