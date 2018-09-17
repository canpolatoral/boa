
  import React from 'react';
  import { BLinearPanel } from '../../src/components/panel/b-linear-panel';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-linear-panel/docs/content.json');
  const defaults = require('../../src/components/panel/b-linear-panel/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BLinearPanel} content={data} defaults={defaults} />
        <Playground component={BLinearPanel} content={data} defaults={defaults} />
        <PropsViewer component={BLinearPanel} content={data} defaults={defaults} />
      </div>);
  };