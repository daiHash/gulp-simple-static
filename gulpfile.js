'use strict';

const emptyDir = require('empty-dir');

// * Packages for GULP
const gulp          = require('gulp'),
      babel         = require('gulp-babel'),
      sass          = require('gulp-sass'),
      cleanCSS      = require('gulp-clean-css'),
      postcss       = require('gulp-postcss'),
      cssnext       = require('postcss-cssnext'),
      connect       = require('gulp-connect'),
      uglify        = require('gulp-uglify'),
      concat        = require('gulp-concat'),
      inject        = require('gulp-inject');

// * Packages for WEBPACK      
const webpackStream = require("webpack-stream"),
      webpack       = require("webpack"),
      webpackConfig = require("./webpack.config");

// * Packages to handle IMAGES
const imagemin      = require('gulp-imagemin'),
      imageminJpg   = require('imagemin-jpeg-recompress'),
      imageminPng   = require('imagemin-pngquant'),
      imageminGif   = require('imagemin-gifsicle'),
      svgmin        = require('gulp-svgmin');

const ROOT          = './src/',
      outputDir     = './dist';

let   NODE_ENV      = process.env.NODE_ENV;

const sassSources   = [ROOT + 'assets/**/*.scss'],
      cssSources    = [ROOT + 'assets/css/*.css', ROOT + 'assets/css/**/*.css'],
      htmlSources   = [ROOT + '*.html'],
      fontSources   = [ROOT + 'assets/fonts/**'],
      jsSources     = [ROOT + 'assets/**/*.js']

// * Check if a directory is empty or not
function checkDirectoryContent(dirPath) { return !(emptyDir.sync(dirPath)) }

// * COPY FILES TO DIST ON BUILD
gulp.task('copy', function() {
  gulp.src(htmlSources).pipe(gulp.dest(outputDir));
 
  if (checkDirectoryContent(ROOT + 'assets/fonts')) {
    gulp.src(fontSources).pipe(gulp.dest(outputDir + '/assets/fonts'))
  }  
});

// * TASK FOR SASS AND CSS FILES 
gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(sass({style: 'expanded'}))
      .on('error', sass.logError)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(ROOT + 'assets/css/'))
    .pipe(connect.reload())
});

// * CSS TASK FOR BUILD PROCESS
gulp.task('css:build', function() {
  var processors = [
    cssnext({browsers: ['last 2 version']})
  ];
  gulp.src(cssSources)
  .pipe(postcss(processors))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest(outputDir + '/assets/css/'));
});

// * TASK TO COMPRESS JPG, JPEG, PNG AMD GIF FILES
gulp.task('imagemin', function(){
  var srcGlob = ROOT + 'assets/images/*.+(jpg|jpeg|png|gif)';
 
  if (checkDirectoryContent(ROOT + 'assets/images')) {
    gulp.src( srcGlob )
      .pipe(imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
            interlaced: false,
            optimizationLevel: 3,
            colors:180
        })
      ]))
      .pipe(gulp.dest(outputDir + '/assets/images'));
  }
});
// * TASK TO COMPRESS SVG FILES
gulp.task('svgmin', function(){
  var srcGlob = ROOT + 'assets/images/*.+(svg)';
    
  if (checkDirectoryContent(ROOT + 'assets/images')) {
    gulp.src( srcGlob )
      .pipe(svgmin())
      .pipe(gulp.dest(outputDir + '/assets/images'));
  }
});

// * JS TASK FOR BUILD PROCESS
gulp.task('js:build', function() {
  NODE_ENV = 'production';
  gulp.src(jsSources)
    .pipe(webpackStream(webpackConfig, webpack))
    // * Uncomment if you want an unminify js file.
    // .pipe(babel())
    .pipe(gulp.dest(outputDir))
});

// * JS TASK FOR JS FILES
gulp.task('js', function() {
  NODE_ENV = 'development';
  gulp.src(jsSources)
    .pipe(webpackStream(webpackConfig, webpack))
    // * Uncomment if you want an unminify js file.
    // .pipe(babel())
    .pipe(gulp.dest(ROOT))
    .pipe(connect.reload())
});

// * WATCH FOR ANY CHANGES MADE IN THE SPECIFIED FILES
gulp.task('watch', function() {
  gulp.watch(jsSources  , ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['html']);
});

// * TASK FOR THE LOCAL SERVER
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

// gulp.task('index', function () {
//   var target = gulp.src(ROOT + 'index.html');
//   // It's not necessary to read the files (will speed up things), we're only after their paths:
//   var sources = gulp.src([ROOT + 'assets/css/style.css']);
 
//   return target.pipe(inject(sources, { relative: true }))
//     .pipe(gulp.dest('./assets/css'));
// });

gulp.task('default', ['html', 'sass', 'js', 'connect', 'watch']);
gulp.task('build', ['copy', 'css:build', 'js:build', 'imagemin', 'svgmin']);