
import React, { Component } from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import { BComponent, injectLocalization } from '../src/base/b-component';
import { BLocalization } from '../src/components/utils/b-localization';
import { BFormManager } from '../src/components/utils/b-form-manager';
import { getTheme } from '../src/base/b-theme';

import Container from './container'
import MessagingHelper from './messaging';

const req = require.context('../stories', true, /.stories.js$/);

const context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

addDecorator(story => <Container context={context} story={story} />)
injectLocalization(BLocalization, MessagingHelper, BFormManager);

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
