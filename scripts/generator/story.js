import path from 'path';
import fs from 'fs';
import jsdom from 'jsdom';
import yargs from 'yargs';

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

const COMPONENTS = '../../src/components/';
const COMPONENTS_DIRECTORY = path.join(__dirname, COMPONENTS);

const options = yargs.option('component', {
  default: 'all',
  type: 'string'
}).argv;

function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}

const getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};


const createStoryFile = (folderName, fileName, story) => {
  if (!fs.existsSync(path.join(__dirname, '..', '..', 'stories'))) {
    fs.mkdirSync(path.join(__dirname, '..', '..', 'stories'));
  }

  if (!fs.existsSync(path.join(__dirname, '..', '..', 'stories', folderName))) {
    fs.mkdirSync(path.join(__dirname, '..', '..', 'stories', folderName));
  } else {
    console.log('SKIP: ' + folderName + ' folder exists...');
  }

  console.log('WRITING: ' + path.join(__dirname, '..', '..', 'stories', folderName, fileName));
  fs.writeFile(path.join(__dirname, '..', '..', 'stories', folderName, fileName), story, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const generateSingleStory = (component) => {
  return `
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { ${component} } from '../../src/components/${component}';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('${component}', module);

  stories.add('${component}', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={${component}} doc={doc} />
        <Preview {...props} component={${component}} doc={doc} />
        <Props {...props} component={${component}} doc={doc} />
      </div>);
  });
  `;
};

propagateToGlobal(win);
const dirs = getDirectories(COMPONENTS_DIRECTORY);

const storyNotRequired = ['Scroll', 'Icon', 'Resizable', 'Dialog', 'LinearPanel', 'ListItem', 'MenuItem'];

dirs.forEach((dir) => {
  if (!storyNotRequired.find(x => x === dir)) {
    if (options.component === 'all' || dir == options.component) {
      const story = generateSingleStory(dir);
      createStoryFile(dir, 'index.stories.js', story);
    }
  }
});
