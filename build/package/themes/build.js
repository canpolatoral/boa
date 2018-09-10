import _ from 'lodash';
import fsp from 'fs-promise';
var fs = require('fs'), path = require('path');
var exec = require('../../lib/exec').default.exec;
var publishLocal = require('../../compose').publishLocal;
var publishNPM = require('../../compose').publishNPM;
var getLocalPublishFolder = require('../../compose').getLocalPublishFolder;

function startPackaging(themeRoot) {
  let cwdPackageRoot = process.cwd();
  var pkgRoot = path.join(themeRoot, 'package');
  var themeentry = path.join(themeRoot, 'index.js');
  var themename = path.basename(themeRoot).toLowerCase().replace(/\s/g, '-');
  var docPath = path.join(cwdPackageRoot, 'build', 'package', 'themes', 'README.md');
  var docTarget = path.join(themeRoot, 'package', 'README.md');

  var infopath = path.join(cwdPackageRoot, 'build', 'package', 'themes', 'info.json');
  var infoJson = require(infopath);
  var infoName = infoJson && infoJson.name ? infoJson.name : '<undefined>';
  var infoVersion = infoJson && infoJson.version ? ('v' + infoJson.version) : '<version undefined>';

  return exec(`rimraf ${pkgRoot}`)
    .then(() => exec(`webpack --env.componententry="${themeentry}" --env.componentname=${themename} --env.distpath="${pkgRoot}" --bail`))
    .then(() => fsp.rename(path.join(pkgRoot, 'bundle.js'), path.join(pkgRoot, 'index.js')))
    .then(() => fsp.copy(docPath, docTarget))
    .then(() => packageGenerator(themeRoot))
    .then(() => console.log(getTime() + ' - Built: npm module '.cyan + themename.green + ' ' + infoVersion.yellow +
      ' [index.js ' + (fileSize(path.join(pkgRoot, 'index.js')) / 1024).toFixed(1) + 'KB]'))
    .then(() => publishLocal(pkgRoot, getLocalPublishFolder(themename)))
    .then(() => publishNPM(pkgRoot));
}

function packageGenerator(themeRoot) {
  let cwdPackageRoot = process.cwd();
  const npmPath = path.join(themeRoot, 'package', 'package.json');
  const pkgJsonPath = path.join(cwdPackageRoot, 'build', 'package', 'themes', 'info.json');
  const licensePath = path.join(cwdPackageRoot, 'build', 'package', 'LICENSE');
  const cmpJsonPath = path.join(themeRoot, 'info.json');
  var pkgJson = fs.existsSync(pkgJsonPath) ? require(pkgJsonPath) : {};
  var cmpJson = fs.existsSync(cmpJsonPath) ? require(cmpJsonPath) : {};
  var target = _.extend({}, cmpJson, pkgJson);
  var data = JSON.stringify(target, null, 4);
  return fsp.writeFile(npmPath, data)
    .then(() => fsp.copy(licensePath, path.join(themeRoot, 'package', 'LICENSE')));
}

function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  }
  catch (err) {
    return 0;
  }
}

function getTime() {
  var date = new Date();
  var hours = format2Digit(date.getHours());
  var minutes = format2Digit(date.getMinutes());
  var seconds = format2Digit(date.getSeconds());
  return hours + ':' + minutes + ':' + seconds;
}

function format2Digit(num) {
  var str = (num || 0).toString();
  return str.length > 1 ? str.substring(0, 2) : str.length == 1 ? '0' + str : '00';
}

export default function Build(themesRoot) {
  return startPackaging(themesRoot);
}
