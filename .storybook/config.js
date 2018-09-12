
import React, { Component } from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
// import '@storybook/addon-knobs/register'
import infoAddon from '@storybook/addon-info'
import { setOptions } from '@storybook/addon-options';

import { BComponent, injectLocalization } from '../src/base/b-component';
import { BLocalization } from '../src/components/utils/b-localization';
import { BFormManager } from '../src/components/utils/b-form-manager';

import Container from './container'

addDecorator(story => <Container story={story}></Container>)
setAddon(infoAddon);

injectLocalization(BLocalization, null, BFormManager);

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
  showDownPanel: false,
  name: 'boa-components',
  url: 'https://github.com/kuveytturk/boa-components',
  sidebarAnimations: true
});
