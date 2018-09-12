import React from 'react';
import { storiesOf } from '@storybook/react';

import { BAvatar } from '../../src/components/avatar/b-avatar';

import PropsViewer from '../base/props-viewer';
import Playground from '../base/playground';
import ComponentInfo from '../base/info';

const data = require('../../src/components/avatar/b-avatar/docs/content.json');
const defaults = require('../../src/components/avatar/b-avatar/assets/data/defaults.json');

const stories = storiesOf('Avatar', module);

stories.add('Avatar', () => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <ComponentInfo component={BAvatar} content={data} defaults={defaults} />
      <Playground component={BAvatar} content={data} defaults={defaults} />
      <PropsViewer component={BAvatar} content={data} defaults={defaults} />
    </div>);
});
