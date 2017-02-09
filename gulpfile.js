/** @fileoverview gulpfile.js

If needed: npm install
To see targets: gulp -T
=============================================================================*/
"use strict";

const
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  clear = require('clear');

const
  SRC_DIR = 'src',
  TEST_DIR = 'test',
  BUILD_DIR = 'build',
  JS_FILES = SRC_DIR+'/**/*.js',
  TEST_FILES = TEST_DIR+'/**/{test_*,*Test}.js',
  RESOURCES=['package.json','README.md','static/**/*'];


// Primitive targets
// -----------------
gulp.task('clean', ['clean-test', 'clean-coverage'], () => {
  return gulp.src(BUILD_DIR)
    .pipe($.rimraf());
});


gulp.task('clean-test', $.shell.task([
  `echo Removing ${TEST_DIR}/index.js`,
  `rm -f ${TEST_DIR}/index.js`
]));

gulp.task('clean-coverage', () => {
  return gulp.src(['coverage'])
    .pipe($.rimraf());
});


gulp.task('very-clean', ['clean'], () => {
  return gulp.src(['*~',SRC_DIR+'/**/*~',TEST_DIR+'/**/*~','dump.rdb'])
    .pipe($.rimraf());
});


gulp.task('dist-clean', ['very-clean'], () => {
  console.log("Hope you know what you are doing...");
  return gulp.src('node_modules')
    .pipe($.rimraf());
});


gulp.task('build', ['xpile','resources']);


gulp.task('xpile', () => {
  return gulp.src(JS_FILES)
    .pipe($.newer(BUILD_DIR))
    .pipe($.shell([ 'echo "Transpile src/<%= file.relative %> -> build/"' ],
                { verbose: false }))
    .pipe($.babel()) // See .babelrc
    .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('prep-test', ['clean-test'], () => {
  console.log('Constructing test/index.js file');
  return gulp.src(TEST_FILES)
    .pipe($.shell([
      `echo "require('./<%= file.relative %>');" >> ${TEST_DIR}/index.js`
    ], { verbose: false }))
});


gulp.task('test', ['prep-test'], $.shell.task([
  'echo Running unit tests',
  `BABEL_ENV=test babel-node ${TEST_DIR}/index.js | tap-colorize`
], { verbose: true }));


gulp.task('cover', ['prep-test'], $.shell.task([
  'echo Running code coverage analysis',
  `BABEL_ENV=test babel-node ./node_modules/.bin/babel-istanbul cover ${TEST_DIR}/index.js | tap-colorize`,
  'babel-istanbul report html',
  'echo Check coverage/index.html report'
], { verbose: true }));


gulp.task('clear', (next) => {
  clear();
  return next();
});


gulp.task('watch', ['build', 'test'], () => {
  return gulp.watch([JS_FILES,TEST_FILES,RESOURCES], ['clear','build','test']);
});


gulp.task('resources', () => {
  return gulp.src(RESOURCES,{base:'.'})
    .pipe($.newer(BUILD_DIR))
    .pipe($.shell([ 'echo "Copy <%= file.relative %> -> build/"' ],
                { verbose: false }))
    .pipe(gulp.dest(BUILD_DIR));
});


// Convenience targets
// -------------------

// watch-run: run via supervisor or: npm run run
// clean-build: gulp clean && gulp build

gulp.task('default', ['watch']);

// EOF
