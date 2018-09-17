import path from 'path';
import fs from 'fs';
import jsdom from 'jsdom';

var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;
global.document = doc;
global.window = win;
global.navigator = {
  userAgent: 'node.js',
  serviceWorker: {
    register: (...args) => {
      console.log(args);
    }
  }
};

function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}

propagateToGlobal(win);

const COMPONENTS = './src/components/';
const COMPONENTS_DIRECTORY = path.join(__dirname, COMPONENTS);


const getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};


const createStoryFile = (folderName, packageName, fileName, story) => {
  if (!fs.existsSync(path.join(__dirname, 'stories'))) {
    fs.mkdirSync(path.join(__dirname, 'stories'));
  } else {
    console.log('SKIP: stories folder exists...');
  }

  if (!fs.existsSync(path.join(__dirname, 'stories', folderName))) {
    fs.mkdirSync(path.join(__dirname, 'stories', folderName));
  } else {
    console.log('SKIP: ' + folderName + ' folder exists...');
  }

  // if (!fs.existsSync(path.join(__dirname, 'stories', folderName, packageName))) {
  //   fs.mkdirSync(path.join(__dirname, 'stories', folderName, packageName));
  // } else {
  //   console.log('SKIP: ' + packageName + ' folder exists...');
  // }

  console.log('WRITING: ' + path.join(__dirname, 'stories', folderName, packageName, fileName));
  fs.writeFile(path.join(__dirname, 'stories', folderName, fileName), story, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateSingleStory = (folderName, packageName, className) => {
  return `
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { ${className} } from '../../src/components/${folderName}/${packageName}';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/${folderName}/${packageName}/docs/content.json');
  const defaults = require('../../src/components/${folderName}/${packageName}/assets/data/defaults.json');

  const stories = storiesOf('${capitalizeFirstLetter(folderName)}', module);

  stories.add('${capitalizeFirstLetter(folderName)}', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={${className}} content={data} defaults={defaults} />
        <Playground component={${className}} content={data} defaults={defaults} />
        <PropsViewer component={${className}} content={data} defaults={defaults} />
      </div>);
  });
  `;
};

const generateMultipleStory = (folderName, packageName, className) => {
  return `
  import React from 'react';
  import { ${className} } from '../../src/components/${folderName}/${packageName}';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/${folderName}/${packageName}/docs/content.json');
  const defaults = require('../../src/components/${folderName}/${packageName}/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={${className}} content={data} defaults={defaults} />
        <Playground component={${className}} content={data} defaults={defaults} />
        <PropsViewer component={${className}} content={data} defaults={defaults} />
      </div>);
  };`;
};

const generateMultipleStoryIndex = (packageName, stories) => {
  return `
import { storiesOf } from '@storybook/react';

const stories = storiesOf('${packageName}', module);
${stories.map((story) => { return `stories.add('${story.name}', require('./${story.package}').default);`; }).join('\n')}`;
};

const dirs = getDirectories(COMPONENTS_DIRECTORY);

dirs.forEach((dir) => {
  if (dir !== 'utils' && dir !== 'test-viewers') {
    const subDirs = getDirectories(path.join(COMPONENTS_DIRECTORY, dir));
    if (subDirs.length === 1) {
      subDirs.forEach((sub) => {
        try {
          console.log('CREATING: ' + sub);
          const component = require(COMPONENTS_DIRECTORY + '/' + dir + '/' + sub);
          const keys = Object.keys(component);

          const className = keys.find(x => x !== 'default' && x[0] === 'B');
          const story = generateSingleStory(dir, sub, className);
          createStoryFile(dir, sub, 'index.stories.js', story);
        } catch (err) {
          console.log('HATA: (' + sub + ')');
          console.log(err);
        }
      });
    } else if (subDirs.length > 1) {
      let stories = [];
      subDirs.forEach((sub) => {
        try {
          console.log('CREATING: ' + sub);
          const component = require(COMPONENTS_DIRECTORY + '/' + dir + '/' + sub);

          const keys = Object.keys(component);

          const className = keys.find(x => x !== 'default' && x[0] === 'B');
          const story = generateMultipleStory(dir, sub, className);
          createStoryFile(dir, sub, sub + '.js', story);
          stories.push({ name: className, package: sub });
        } catch (err) {
          console.log('HATA: (' + sub + ')');
          console.log(err);
        }
      });
      const indexStory = generateMultipleStoryIndex(capitalizeFirstLetter(dir), stories);
      createStoryFile(dir, dir, 'index.stories.js', indexStory);
    }
  }
});
