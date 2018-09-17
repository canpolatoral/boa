
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { BDrawer } from '../../src/components/drawer/b-drawer';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/drawer/b-drawer/docs/content.json');
  const defaults = require('../../src/components/drawer/b-drawer/assets/data/defaults.json');

  const stories = storiesOf('Drawer', module);

  stories.add('Drawer', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDrawer} content={data} defaults={defaults} />
        <Playground component={BDrawer} content={data} defaults={defaults} />
        <PropsViewer component={BDrawer} content={data} defaults={defaults} />
      </div>);
  });
  