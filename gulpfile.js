const path = require('path');
const gulp = require('gulp');
const keva = require('keva');
const decb = require('decb');
const escape = require('escape-html');
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
  html: 'src/markup/**/*.hbs',
  js: 'src/script/**/*.js'
};
const frix = require('frix');

frix.api.getOpt().root += 'frix/';

Handlebars.registerHelper('tree', (context, options) => {
  return '<ul class="tree">' +tree(context, '', 'ul');
});

function tree(context, dev, ...closeTags) {
  let ret = '';
  for (let [key, val] of keva(context)) {
    if(val.value) {
      ret += `<li class="link" data-value="${val.value}" data-type="${val.type}" data-dev="${dev} ${key}"><span>${key}</span></li>`;
    } else {
      ret += `<li><span>${key}</span><ul>`;
      ret += tree(val, `${dev} ${key}`, 'ul', 'li');
    }
  }
  ret += closeTags.map(tag => `</${tag}>`).join('');
  return ret;
}

gulp.task('html', function (done) {
  let data = {};
  frix.render({dev: true}).then(() => {
    let promises = [];
    data.pages = frix.api.getAllPages();
    data.content = {};
    for ([key, val] of keva(data.pages)) {
      (function(key, val) {
        promises.push(fs.readFile(val.filename).then((file) => {
          data.pages[key].html = file.toString();
          data.content[key] = frix.api.getContentStructure(key);
        }));
      })(key, val);
    }

    Promise.all(promises).then(() => {

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

      done();
    });
  });
});

gulp.task('css', () => {
  gulp.src(watch.css)
    .pipe(postcss([
      require('postcss-cssnext')
    ]))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('js', () => {
  gulp.src(watch.js)
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
  console.log('js task run');
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
  gulp.start('css', 'html', 'js', 'watch');
});
