const path = require('path');
const gulp = require('gulp');
const keva = require('keva');
const decb = require('decb');
const fs = decb(require('fs'), {
  use: ['readFile', 'writeFile']
});
const postcss = require('gulp-postcss');
const connect = require('gulp-connect');
const Handlebars = require('handlebars');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const posthtml = require('gulp-posthtml');
const inline = require('gulp-inline');
const watch = {
  css: 'src/style/**/*.css',
  html: 'src/markup/**/*.hbs'
}
const frix = require('frix');

let app = express();
frix.render().then(() => {
  console.log(frix);
});

Handlebars.registerHelper('tree', (context, options) => {
  return '<ul class="tree">' +tree(context, 'ul');
});

function tree(context, ...closeTags) {
  let ret = '';

  for (let [key, val] of keva(context)) {
    if(val.value) {
      ret += `<li class="link" data-value="${val.value}" data-type="${val.type}">${key}</li>`;
    } else {
      ret += `<li>${key}<ul>`;
      ret += tree(val, 'li', 'ul');
    }
  }
  ret += closeTags.map(tag => `</${tag}>`).join('');
  return ret;
}

gulp.task('html', function () {
  let data = {};
  data.pages = frix.gui.getAllPages();
  data.content = frix.gui.getContentStructure();

  let bemData = {
        elemPrefix: '__',
        modPrefix: '--',
        modDlmtr: '_'
  };

  gulp.src(watch.html)
    .pipe(posthtml([
          require('posthtml-bem')(bemData)
    ]))
    .pipe(handlebars(data, {
      ignorePartials: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(inline({
      base: 'src/images'
    }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('css', () => {
  gulp.src('src/style/main.css')
    .pipe(postcss([
      require('postcss-cssnext')
    ]))
    .pipe(gulp.dest('build'))
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

gulp.task('default', ['connect'], () => {
  gulp.start('css', 'html', 'watch');
});
