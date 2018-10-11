import 'colors';
import lib from './lib/build';
import baseComp from './lib/base';
import webpackCompiler from './webpack/build';
import fsp from 'fs-promise';
import mdDocCompiler from './docs/mddoc';
import packageGenerator from './package/build';
import themeBuilder from './package/themes/build';

var exec = require('./lib/exec').default.exec;
var cp = require('child_process');
var fs = require('fs'), path = require('path');

const componentsRoot = path.resolve('src', 'components');
const baseRoot = path.resolve('src', 'base', '@boa/base');
const themesRoot = path.resolve('src', 'base', 'b-theme');

import yargs from 'yargs';

/* eslint-disable no-console */
// Argumentleri parse etmeye yarar
export const cmpOptions = yargs.alias('library', 'all').alias('themelibrary', 'allthemes').option('components', {
  default: undefined,
  type: 'string'
}).argv;

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err) {
    return false;
  }
}

export function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  }
  catch (err) {
    return 0;
  }
}

export function format2Digit(num) {
  var str = (num || 0).toString();
  return str.length > 1 ? str.substring(0, 2) : str.length == 1 ? '0' + str : '00';
}

export function getTime() {
  var date = new Date();
  var hours = format2Digit(date.getHours());
  var minutes = format2Digit(date.getMinutes());
  var seconds = format2Digit(date.getSeconds());
  return hours + ':' + minutes + ':' + seconds;
}

function startPackaging(componentRoot, compilations, errors) {
  var pkgRoot = path.join(componentRoot, 'package');
  var distpath = path.join(componentRoot, 'package', 'dist', 'js');
  var componententry = path.join(componentRoot, 'index.js');
  var testentry = path.join(componentRoot, 'test', 'spec.js');
  var componentDirectoryName = path.basename(componentRoot);
  var componentname = componentDirectoryName.toLowerCase().replace(/\s/g, '-');
  var packageIndexJsPath = path.join(componentRoot, 'package', 'index.js');
  var infopath = path.join(componentRoot, 'assets', 'data', 'info.json');
  changeVersion(infopath);
  var infoJson = require(infopath);
  var infoName = infoJson && infoJson.name ? infoJson.name : '<undefined>';
  var infoVersion = infoJson && infoJson.version ? ('v' + infoJson.version) : '<version undefined>';
  if (infoName !== componentname) {
    var componentsDirectoryName = '\\components\\';
    var componentsPathStartIndex = componentRoot.indexOf(componentsDirectoryName);
    var shortComponentsPath = componentsPathStartIndex >= 0 ? componentRoot.substring(componentsPathStartIndex + componentsDirectoryName.length, componentRoot.length - componentDirectoryName.length) : componentRoot;
    errors.push(() => {
      return console.log(shortComponentsPath.red + componentDirectoryName.underline.gray + '\\assets\\data\\'.red + 'info.json->name:'.red + infoName.yellow + ' is not same with the component directory:'.red + componentDirectoryName.yellow);
    });
  }
  else {
    var ignoredFilesObj = infoJson.dependencies;
    var ignoredFiles = '';
    if (ignoredFilesObj) {
      ignoredFiles = Object.keys(ignoredFilesObj);
    }

    compilations.push(() => {
      return exec(`rimraf ${pkgRoot}`)
        .then(() => lib(componentRoot, componentname, componententry, ignoredFiles))
        .then(() => webpackCompiler(componentname, componententry, distpath, testentry, ignoredFiles))
        .then(() => fsp.rename(path.join(distpath, 'bundle.js'), path.join(distpath, componentname + '.js')))
        .then(() => fsp.rename(path.join(distpath, 'bundle.min.js'), path.join(distpath, componentname + '.min.js')))
        .then(() => fsp.rename(path.join(distpath, 'bundle.min.js.map'), path.join(distpath, componentname + '.min.js.map')))
        .then(() => mdDocCompiler(componentRoot))
        .then(() => packageGenerator(componentRoot))
        .then(() => console.log(getTime() + ' - Built: npm module '.cyan + componentname.green + ' ' + infoVersion.yellow +
          ' [index.js ' + (fileSize(packageIndexJsPath) / 1024).toFixed(1) + 'KB]'))
        .then(()=> publishLocal(pkgRoot, getLocalPublishFolder(componentname)))
        .then(()=> publishNPM(pkgRoot));
    });
  }
}

function startBasePackaging(baseRoot, compilations) {
  console.log(baseRoot);
  var pkgRoot = path.join(baseRoot, 'package');
  var basecomponentname = '@boa/base';

  var infopath = path.resolve(path.join('build', 'package', 'base', 'info.json'));
  changeVersion(infopath);
  var infoJson = require(infopath);
  // var infoName = infoJson && infoJson.name ? infoJson.name : '<undefined>';
  var infoVersion = infoJson && infoJson.version ? ('v' + infoJson.version) : '<version undefined>';
  var packageIndexJsPath = path.join(pkgRoot, 'index.js');

  compilations.push(() => {
    return exec(`rimraf ${pkgRoot}`) // rimraf directory nin için siler
      .then(() => baseComp(pkgRoot, baseRoot))
      .then(() => console.log(getTime() + ' - Built: npm module '.cyan + basecomponentname.green + ' ' + infoVersion.yellow +
        ' [index.js ' + (fileSize(packageIndexJsPath) / 1024).toFixed(1) + 'KB]'))
      .then(()=> publishLocal(pkgRoot, getLocalPublishFolder(basecomponentname)))
      .then(()=> publishNPM(pkgRoot));
  });
}

export function getLocalPublishFolder(componentname) {
  return getOneScriptFolder() + '/node_modules/' + componentname;
}

export function getOneScriptFolder() {
  return cmpOptions.path ? `d:/boa/${cmpOptions.path}.scripts` : 'd:/boa/one.scripts';
}

export function publishLocal(srcDirectory, deployDirectory) {
  var promise;
  if (cmpOptions.pl) {
    promise = exec(`rimraf ${deployDirectory}`)
      .then(() => fsp.copySync(srcDirectory, deployDirectory))
      .then(() => console.log(getTime() + ' - Published to local folder'.cyan + ': ' + deployDirectory.yellow));
  }

  if (cmpOptions.b) {
    promise.then(() => cp.execSync('npm run tscompile', {cwd:getOneScriptFolder()}))
      .then(() => console.log(getTime() + ' - Typescript compilation finished successfully.'.cyan))
      .then(() => cp.execSync('npm run dowebpack', {cwd:getOneScriptFolder()}))
      .then(() => console.log(getTime() + ' - Webpack finished successfully.'.cyan));
  }
}

export function publishNPM(srcDirectory) {
  if (cmpOptions.ps) {
    cp.execSync(`npm publish ${srcDirectory}`, {cwd:srcDirectory});
    console.log(getTime() + ' - Published to private NPM server'.cyan);
  }
}

export function changeVersion(infopath) {
  if (cmpOptions.ps) { // change version only publish to server option is enabled
    var infoJson = require(infopath);
    if (infoJson.version) {
      if (cmpOptions.v) {
        infoJson.version = cmpOptions.v;
        if (infoJson.dependencies) {
          for (var dependency in infoJson.dependencies) {
            if (dependency.startsWith('b-')) {
              infoJson.dependencies[dependency] = '^' + cmpOptions.v;
            }
          }
        }
      } else {
        infoJson.version = versionIncrement(infoJson.version);
      }
    }
    fs.writeFileSync(infopath, JSON.stringify(infoJson, null, 4));
  }
}

export function versionIncrement(versionString) {
  var versionArrayString = versionString.split('.');
  var versionArrayNumber = versionArrayString.map(value => { return parseInt(value); });
  versionArrayNumber[versionArrayNumber.length - 1]++;
  var newVersion = versionArrayNumber.join('.');
  return newVersion.toString();
}

function getDirectories(srcpath, compilations, errors) {
  var directories = fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
  directories.forEach(function (directory) {
    if (directory !== '@boa/base' && directory !== 'package' && directory.indexOf('test-viewer') < 0) {
      var possibleCategory = path.join(srcpath, directory);
      if (fileExists(path.join(possibleCategory, 'index.js'))) {
        startPackaging(possibleCategory, compilations, errors);
      }
      else {
        getDirectories(possibleCategory, compilations, errors);
      }
    }
  });
}

function getComponentsDirectories(components, srcpath, compilations, errors) {

  var directories = fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
  directories.forEach(function (directory) {
    if (directory !== '@boa/base' && directory !== 'package' && directory.indexOf('test-viewer') < 0) {
      var possibleCategory = path.join(srcpath, directory);
      var componentname = path.basename(possibleCategory).toLowerCase().replace(/\s/g, '-');
      if (fileExists(path.join(possibleCategory, 'index.js')) && components.indexOf(componentname) > -1) {
        startPackaging(possibleCategory, compilations, errors);
      }
      else {
        getComponentsDirectories(components, possibleCategory, compilations, errors);
      }
    }
  });
}

export default function Build() {
  var compilations = [];
  var errors = [];
  console.log(getTime() + ' - Build started'.cyan);

  if (cmpOptions.components) {
    buildComponent(compilations, errors);
  }
  else if (cmpOptions.base) {
    buildBaseComponent(compilations, errors);
  }
  else if (cmpOptions.theme) {
    buildTheme(compilations);
  }
  else if (cmpOptions.all) {
    buildAll(compilations, errors);
  }
  else {
    buildAllComponents(compilations, errors);
  }

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

function buildComponent(compilations, errors) {
  var components = cmpOptions.components.split(',').map(function (value) { return value.toLowerCase(); });
  getComponentsDirectories(components, componentsRoot, compilations, errors);
}

function buildAllComponents(compilations, errors) {
  const uiRoot = path.join(componentsRoot, 'ui');
  const businessRoot = path.join(componentsRoot, 'business');
  const utilsRoot = path.join(componentsRoot, 'utils');
  getDirectories(uiRoot, compilations, errors);
  getDirectories(businessRoot, compilations, errors);
  getDirectories(utilsRoot, compilations, errors);
}

function buildTheme(compilations) {
  compilations.push(() => { return themeBuilder(themesRoot); });
}

function buildBaseComponent(compilations, errors) {
  startBasePackaging(baseRoot, compilations, errors);
}

function buildAll(compilations, errors) {
  buildBaseComponent(compilations, errors);
  buildTheme(compilations);
  buildAllComponents(compilations, errors);
}
