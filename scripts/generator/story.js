/* eslint-disable no-console */

import path from 'path';
import fs from 'fs';
import yargs from 'yargs';

const COMPONENTS = '../../src/components/';
const COMPONENTS_DIRECTORY = path.join(__dirname, COMPONENTS);
const storyNotRequired =
  ['Scroll', 'Icon', 'Resizable', 'Dialog', 'LinearPanel', 'ListItem', 'MenuItem'];

const options = yargs.option('component', {
  default: 'all',
  type: 'string',
}).argv;

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
    console.log(`SKIP: ${folderName} folder exists...`);
  }

  console.log(`WRITING: ${path.join(__dirname, '..', '..', 'stories', folderName, fileName)}`);
  fs.writeFile(path.join(__dirname, '..', '..', 'stories', folderName, fileName), story, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const generateSingleStory = (component) => {
  return `
/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ${component} } from '../../src/components/${component}';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('${component}', module);

stories.add('${component}', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={${component}} doc={doc} />
      <Preview {...props} component={${component}} doc={doc} />
      <Props {...props} component={${component}} doc={doc} />
    </div>);
  });`;
};

const generate = () => {
  const dirs = getDirectories(COMPONENTS_DIRECTORY);

  dirs.forEach((dir) => {
    if (!storyNotRequired.find(x => x === dir)) {
      if (options.component === 'all' || dir === options.component) {
        const story = generateSingleStory(dir);
        createStoryFile(dir, 'index.stories.js', story);
      }
    }
  });
};

generate();
