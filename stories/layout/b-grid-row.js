
  import React from 'react';
  import { BGridRow } from '../../src/components/layout/b-grid-row';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-grid-row/docs/content.json');
  const defaults = require('../../src/components/layout/b-grid-row/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BGridRow} content={data} defaults={defaults} />
        <Playground component={BGridRow} content={data} defaults={defaults} />
        <PropsViewer component={BGridRow} content={data} defaults={defaults} />
      </div>);
  };