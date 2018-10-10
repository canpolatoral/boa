import React, { Component } from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import jquery from 'jquery';

import Container from './container'

global.$ = jquery;
global.jQuery = jquery;

addDecorator((story, context) => {
  return (<Container story={story} context={context} />);
});

const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  const gettingStarted = './getting-started/index.stories.js';
  req(gettingStarted);
  req.keys().forEach((filename) => {
    if (filename !== gettingStarted) {
      req(filename);
    }
  });
}

configure(loadStories, module);
setOptions({
  showDownPanel: true,
  downPanelInRight: true,
  name: 'boa-components',
  url: 'https://github.com/kuveytturk/boa-components',
  sidebarAnimations: true
});
