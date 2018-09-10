import 'colors';
import fsp from 'fs-promise';
var exec = require('../lib/exec').default.exec;
var fs = require('fs'), path = require('path');
var gulp = require('gulp-param')(require('gulp'),process.argv);
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function runLessCompiler(pkgCssRoot, srcRoot, index) {
  return fsp.mkdirs(pkgCssRoot)
    .then(() => {
      gulp.task('less', function () {
        return gulp.src(srcRoot + '/**/*.less')
          .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
          }))
          .pipe(sourcemaps.init())
          .pipe(minifyCSS())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(pkgCssRoot));
      });
      return gulp.start('less');
    });
}

export default function BuildCss(componentRoot, isDev) {
  var pkgCssRoot;
  if(isDev) {
    pkgCssRoot = path.join(componentRoot, 'assets','styles','dev', 'css');
  }else{
    pkgCssRoot = path.join(componentRoot, 'package', 'dist', 'css');
  }

  var srcRoot = path.join(componentRoot, 'assets', 'styles');
  return runLessCompiler(pkgCssRoot, srcRoot);
}