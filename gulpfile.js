'use strict';

var emptyDir = require('empty-dir');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    autoprefixer = require('gulp-autoprefixer');

var ROOT = './src/';
// var coffeeSources = ['scripts/hello.coffee'],
    // jsSources = ['scripts/*.js'],
var sassSources = [ROOT + 'assets/**/*.scss'],
    cssSources = [ROOT + 'assets/css/*.css', ROOT + 'assets/css/**/*.css'],
    htmlSources = [ROOT + '*.html'],
    fontSources = [ROOT + 'assets/fonts/**'],
    outputDir = 'dist';

function checkDirectoryContent(dirPath) {
  return !(emptyDir.sync(dirPath))
}

gulp.task('log', function() {
  gutil.log('== My First Task ==')
});

gulp.task('copy', function() {
  console.log("start");
  
  gulp.src(htmlSources).pipe(gulp.dest(outputDir));
 
  if (checkDirectoryContent(ROOT + 'assets/fonts')) {
    gulp.src(fontSources).pipe(gulp.dest(outputDir + '/assets/fonts'))
  }
  
  
});

gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(sass({style: 'expanded'}))
      .on('error', sass.logError)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(ROOT + 'assets/css/'))
    .pipe(connect.reload())
});

gulp.task('css:build', function() {
  var processors = [
      cssnext({browsers: ['last 2 version']})
  ];
  gulp.src(cssSources)
    .pipe(postcss(processors))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(outputDir + '/assets/css/'));
});


// gulp.task('coffee', function() {
//   gulp.src(coffeeSources)
//   .pipe(coffee({bare: true})
//     .on('error', gutil.log))
//   .pipe(gulp.dest('scripts'))
// });

// gulp.task('js', function() {
//   gulp.src(jsSources)
//   .pipe(uglify())
//   .pipe(concat('script.js'))
//   .pipe(gulp.dest(outputDir))
//   .pipe(connect.reload())
// });

gulp.task('watch', function() {
  // gulp.watch(coffeeSources, ['coffee']);
  // gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: ROOT,
    livereload: true
  })
});

gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(connect.reload())
});

gulp.task('index', function () {
  var target = gulp.src(ROOT + 'index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/assets/**/*.js', ROOT + 'assets/css/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./assets/'));
});

gulp.task('default', ['index', 'html', 'sass', 'connect', 'watch']);
gulp.task('build', ['copy', 'css:build']);