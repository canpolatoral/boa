
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { BToolTip } from '../../src/components/tooltip/b-tool-tip';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/tooltip/b-tool-tip/docs/content.json');
  const defaults = require('../../src/components/tooltip/b-tool-tip/assets/data/defaults.json');

  const stories = storiesOf('Tooltip', module);

  stories.add('Tooltip', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BToolTip} content={data} defaults={defaults} />
        <Playground component={BToolTip} content={data} defaults={defaults} />
        <PropsViewer component={BToolTip} content={data} defaults={defaults} />
      </div>);
  });
  