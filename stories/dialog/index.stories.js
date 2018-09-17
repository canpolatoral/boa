
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { BDialog } from '../../src/components/dialog/b-dialog-box';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/dialog/b-dialog-box/docs/content.json');
  const defaults = require('../../src/components/dialog/b-dialog-box/assets/data/defaults.json');

  const stories = storiesOf('Dialog', module);

  stories.add('Dialog', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDialog} content={data} defaults={defaults} />
        <Playground component={BDialog} content={data} defaults={defaults} />
        <PropsViewer component={BDialog} content={data} defaults={defaults} />
      </div>);
  });
  