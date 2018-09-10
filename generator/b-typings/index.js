import 'colors';
import webpackCompiler from '../../build/webpack/build';
import fsp from 'fs-promise';
import _ from 'lodash-compat';
import {
  getTime,
  getLocalPublishFolder,
  changeVersion,
  publishNPM,
  publishLocal,
  fileSize
} from '../../build/compose';

var exec = require('../../build/lib/exec').default.exec;
var fs = require('fs'), path = require('path');
// var cp = require('child_process');
// const argv = require('yargs').argv;

export function build() {

  var compilations = [];
  var errors = [];
  console.log(getTime() + ' - Typings Package Generation started'.cyan);

  const typingsDirectory = path.resolve('generator/b-typings/typings');
  startTypingsPackaging(typingsDirectory, compilations, errors);
}

function startTypingsPackaging(typingsRoot, compilations, errors) {
  var pkgRoot = path.join(typingsRoot, '../', 'package');
  var distpath = path.join(pkgRoot, 'dist', 'js');
  var frameworkentry = path.join(typingsRoot, 'index.js');
  var configpath = path.join('./', 'webpack.framework.js');
  var modulename = 'b-typings';
  
  // var infopath = path.resolve(path.join('build', 'package', 'typings', 'info.json'));
  var infopath = path.join(typingsRoot, '../', 'assets', 'data', 'info.json');
  changeVersion(infopath);
  var infoJson = require(infopath);
    // var infoName = infoJson && infoJson.name ? infoJson.name : '<undefined>';
  var infoVersion = infoJson && infoJson.version ? ('v' + infoJson.version) : '<version undefined>';
  var packageIndexJsPath = path.join(pkgRoot, 'index.js');
  
  compilations.push(() => {
    return exec(`rimraf ${pkgRoot}`)
      .then(() => webpackCompiler(modulename, frameworkentry, pkgRoot, configpath))
      .then(() => webpackCompiler(modulename, frameworkentry, distpath, configpath))
      .then(() => fsp.rename(path.join(distpath, 'bundle.js'), path.join(distpath, modulename + '.js')))
      .then(() => fsp.rename(path.join(pkgRoot, 'bundle.js'), path.join(pkgRoot, 'index.js')))
      .then(() => BuildPackageJson(typingsRoot, pkgRoot))
      .then(() => console.log(getTime() + ' - Built: npm module '.cyan + modulename.green + ' ' + infoVersion.yellow +
          ' [index.js ' + (fileSize(packageIndexJsPath) / 1024).toFixed(1) + 'KB]'))
      .then(()=> publishLocal(pkgRoot, getLocalPublishFolder(modulename)))
      .then(()=> publishNPM(pkgRoot));
  });

  var hasErrors = errors && errors.length && errors.length > 0;
  if (hasErrors) {
    console.log('There are some errors, build failed.'.red);
  }
  var hasCompilations = !hasErrors && compilations && compilations.length && compilations.length > 0;
  var promiseFunctions = hasErrors ? errors : hasCompilations ? compilations : [];
 
  if (!hasErrors && !hasCompilations) {
    console.log('No component built!'.red);
  }
 
  var promises = [];
  for (var i = 0; i < promiseFunctions.length; i++) {
    // promises.push(promiseFunctions[i]);
    promises.push(new Promise((resolve, reject) => {
      try {
        Promise.resolve(promiseFunctions[i]())
          .catch((reason) => { console.log(reason); });
      }
      catch (e) {
        console.log(e);
        reject(e);
      }
    }));
  }
 
  return Promise.all(promises);
}

export default function BuildPackageJson(typingsRoot, pkgRoot ) {
  let cwdPackageRoot = process.cwd();
  const npmPath = path.join(pkgRoot, 'package.json');
  const pkgJsonPath = path.join(typingsRoot, '../', 'assets', 'data', 'info.json');
  // const pkgJsonPath = path.join(cwdPackageRoot, 'build', 'package', 'typings', 'info.json');
  const licensePath = path.join(cwdPackageRoot, 'build', 'package', 'LICENSE');
  // const readmePath = path.join(cwdPackageRoot, 'build', 'package', 'typings', 'README.md');
  // const copyPath = path.join(cwdPackageRoot, 'build', 'package', 'typings', 'copy.js');
  const copyPath = path.join(typingsRoot, '../', 'assets', 'data', 'copy.js');
  var pkgJson = fs.existsSync(pkgJsonPath) ? require(pkgJsonPath) : {};
  var target = _.extend({}, pkgJson);
  var data = JSON.stringify(target, null, 4);
  return fsp.writeFile(npmPath, data)
    .then(() => fsp.copy(licensePath, path.join(pkgRoot, 'LICENSE')))
    // .then(() => fsp.copy(readmePath, path.join(pkgRoot, 'README.md')))
    // .then(() => fsp.copy(readmePath, path.join(pkgRoot, 'README.md')))
    .then(() => fsp.copy(copyPath, path.join(pkgRoot, 'copy.js')))
    .then(() => fsp.copy(typingsRoot, path.join(pkgRoot, 'typings')));
}

build();