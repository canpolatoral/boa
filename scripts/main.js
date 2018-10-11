import 'colors';
import path from 'path';
import fse from 'fs-extra';

import exec from './exec';
import buildCommonJs from './build-common';
import webpackCompiler from './webpack/build';

async function copyFile(file) {
  const buildPath = path.resolve(__dirname, '../build/', path.basename(file));
  await fse.copy(file, buildPath);
  console.log(`Copied ${file} to ${buildPath}`);
}

async function createPackageFile() {
  const packageData = fse.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'utf8' });
  // eslint-disable-next-line
  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(
    packageData,
  );
  const newPackageData = {
    ...packageDataOther,
    main: './index.js',
    module: './index.es.js',
    private: false,
  };
  const buildPath = path.resolve(__dirname, '../build/package.json');

  await fse.writeFileSync(buildPath, JSON.stringify(newPackageData, null, 2), 'utf8');
  console.log(`Created package.json in ${buildPath}`);

  return newPackageData;
}

async function build() {
  try {
    await exec(`rimraf ${path.join(__dirname, '../build/**')}`);
    await buildCommonJs(path.join(__dirname, '../build'), 'boa-components', path.join(__dirname, '../src/index.js'), '');
    await webpackCompiler('boa-components', path.join(__dirname, '../src/index.js'), path.join(__dirname, '../build'), '', '');
    await copyFile(path.join(__dirname, '../README.md'));
    await copyFile(path.join(__dirname, '../LICENSE'));
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
