
import React, { Component } from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import '@storybook/addon-knobs/register'
import infoAddon from '@storybook/addon-info'
import Container from './container'

addDecorator(story => <Container story={story}></Container>)
setAddon(infoAddon);
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}


configure(loadStories, module);
