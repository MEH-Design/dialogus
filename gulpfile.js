const path = require("path");
const gulp = require("gulp");
const keva = require("keva");
const posthtml = require('gulp-posthtml');
const postcss = require('gulp-postcss');
const connect = require('gulp-connect');
const watch = {
  css: 'src/style/**/*.css',
  html: 'src/markup/**/*.html'
}

gulp.task('html', function () {
  return gulp.src(watch.html)
    .pipe(posthtml([
        require('posthtml-bem')({
            elemPrefix: '__',
            modPrefix: '--',
            modDlmtr: '_'
        })
    ]))
    .pipe(gulp.dest('build/'))
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
