import 'colors';
import { exec } from './exec';
import fsp from 'fs-promise';
import { buildWithWebpack } from './build-babel';
var fs = require('fs'), path = require('path');

function buildWorkflow(libRoot, srcRoot, componentName, componentEntry, ignoredFiles) {

  fs.exists(path.join(srcRoot, 'assets', 'images'), (exists) => {
    if (!exists) {
      fs.mkdirSync(path.join(srcRoot, 'assets', 'images'));
    }
  });

  return fsp.mkdirs(libRoot)
    .then(() => buildWithWebpack(libRoot, componentName, componentEntry, ignoredFiles)).catch((reason) => { console.log('error in buildWithWebpack: ' + reason); throw reason; })
    .then(() => fsp.copy(path.join(srcRoot, 'assets', 'images'), path.join(libRoot, 'assets', 'images')))
    .then(() => fsp.copy(path.join(srcRoot, 'assets', 'data', 'defaults.json'), path.join(libRoot, 'assets', 'data', 'defaults.json')))
    .then(() => fsp.copy(componentEntry, path.join(libRoot, 'src', 'index.js')))
    .then(() => fsp.copy(path.join(srcRoot, 'assets'), path.join(libRoot, 'src', 'assets')));
}

export default function BuildCommonJs(componentRoot, componentName, componentEntry, ignoredFiles) {
  var pkgRoot = path.join(componentRoot, 'package');
  return buildWorkflow(pkgRoot, componentRoot, componentName, componentEntry, ignoredFiles);
}
