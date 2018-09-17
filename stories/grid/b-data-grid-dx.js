
  import React from 'react';
  import { BDataGrid } from '../../src/components/grid/b-data-grid-dx';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/grid/b-data-grid-dx/docs/content.json');
  const defaults = require('../../src/components/grid/b-data-grid-dx/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDataGrid} content={data} defaults={defaults} />
        <Playground component={BDataGrid} content={data} defaults={defaults} />
        <PropsViewer component={BDataGrid} content={data} defaults={defaults} />
      </div>);
  };