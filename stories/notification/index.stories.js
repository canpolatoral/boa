
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { BNotification } from '../../src/components/notification/b-notification';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/notification/b-notification/docs/content.json');
  const defaults = require('../../src/components/notification/b-notification/assets/data/defaults.json');

  const stories = storiesOf('Notification', module);

  stories.add('Notification', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BNotification} content={data} defaults={defaults} />
        <Playground component={BNotification} content={data} defaults={defaults} />
        <PropsViewer component={BNotification} content={data} defaults={defaults} />
      </div>);
  });
  