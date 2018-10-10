import { transform } from 'babel-core';
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import outputFileSync from 'output-file-sync';
var exec = require('./exec').default.exec;

export function buildContent(content, filename, destination, babelOptions = {}) {
  babelOptions.filename = filename;
  //babelOptions.plugins = ["transform-proto-to-assign"];
  const result = transform(content, babelOptions);
  outputFileSync(destination, result.code, {encoding: 'utf8'});
}

export function buildWithWebpack(destination, componentName, componentEntry, ignoredFiles) {
  return exec(`webpack --config webpack-transform.config.js --env.componententry="${componentEntry}" --env.componentname=${componentName} --env.distpath="${destination}" --env.ignoredFiles=${ignoredFiles} --bail`);
}

export function buildFile(filename, destination, babelOptions = {}) {
  const content = fs.readFileSync(filename, {encoding: 'utf8'});
  // We only have .js files that we need to build
  if (path.extname(filename) === '.js') {
    const outputPath = path.join(destination, path.basename(filename));
    // console.log('%s => %s', filename, outputPath);
    buildContent(content, filename, outputPath, babelOptions);
  }
}

export function buildFolder(folderPath, destination, babelOptions = {}, firstFolder = true) {
  let stats = fs.statSync(folderPath);
  if (stats.isFile()) {
    buildFile(folderPath, destination, babelOptions);
  } else if (stats.isDirectory()) {
    var basePath = path.basename(folderPath);
    if(firstFolder || basePath == 'assets' || basePath == 'data') {
      let outputPath = firstFolder ? destination : path.join(destination, path.basename(folderPath));
      let files = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
      files.forEach(filename => buildFolder(filename, outputPath, babelOptions, false));
    }
  }
}

export function buildGlob(filesGlob, destination, babelOptions = {}) {
  let files = glob.sync(filesGlob);
  if (!files.length) {
    files = [filesGlob];
  }
  files.forEach(filename => buildFolder(filename, destination, babelOptions, true));
}
