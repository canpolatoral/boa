/* eslint-disable no-console */

import 'colors';
import path from 'path';
import glob from 'glob';
import fse from 'fs-extra';
import webpackCompiler from './webpack/build';

async function copyFile(file) {
  const buildPath = path.resolve(__dirname, '../build/', path.basename(file));
  await fse.copy(file, buildPath);
  console.log(`Copied ${file} to ${buildPath}`);
}

async function createPackageFile() {
  const packageData = fse.readFileSync(path.join(__dirname, '../package.json'),
    { encoding: 'utf8' });

  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(
    packageData,
  );
  const newPackageData = {
    ...packageDataOther,
    main: './index.js',
    module: './index.es.js',
    typings: 'index.d.ts',
    private: false,
  };
  const buildPath = path.resolve(__dirname, '../build/package.json');

  await fse.writeFileSync(buildPath, JSON.stringify(newPackageData, null, 2), 'utf8');
  console.log(`Created package.json in ${buildPath}`);

  return newPackageData;
}

function getIgnoredFiles() {
  const packageData = fse.readFileSync(path.join(__dirname, '../package.json'),
    { encoding: 'utf8' });
  const { dependencies } = JSON.parse(packageData);
  return dependencies ? Object.keys(dependencies) : '';
}

function copyTypingsFiles(from, to) {
  const files = glob.sync('**/*.d.ts', { cwd: from });
  const cmds = files.map(file => fse.copy(path.resolve(from, file), path.resolve(to, file)));
  return Promise.all(cmds);
}

async function build() {
  try {
    // await exec(`rimraf ${path.join(__dirname, '../build/**')}`);
    // await buildCommonJs(path.join(__dirname, '../build'),
    //  'boa-components', path.join(__dirname, '../src/index.js'), '');
    const indexPath = path.join(__dirname, '../src/index.js');
    const srcParh = path.resolve(__dirname, '../src');
    const umdPath = path.join(__dirname, '../build/umd');
    const buildPath = path.join(__dirname, '../build');
    await webpackCompiler('@boa/components', indexPath, umdPath, '', getIgnoredFiles());
    await copyFile(path.join(__dirname, '../README.md'));
    await copyFile(path.join(__dirname, '../LICENSE'));
    copyTypingsFiles(srcParh, buildPath);
    await createPackageFile();
  } catch (err) {
    if (err.stack) {
      console.error(err.stack.red);
    } else {
      console.error(err.toString().red);
    }
  }
}

build();
