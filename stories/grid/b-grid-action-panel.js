
  import React from 'react';
  import { BGridActionPanel } from '../../src/components/grid/b-grid-action-panel';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/grid/b-grid-action-panel/docs/content.json');
  const defaults = require('../../src/components/grid/b-grid-action-panel/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BGridActionPanel} content={data} defaults={defaults} />
        <Playground component={BGridActionPanel} content={data} defaults={defaults} />
        <PropsViewer component={BGridActionPanel} content={data} defaults={defaults} />
      </div>);
  };