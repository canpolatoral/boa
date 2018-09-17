
  import React from 'react';
  import { BCustomDataGrid } from '../../src/components/grid/b-custom-data-grid';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/grid/b-custom-data-grid/docs/content.json');
  const defaults = require('../../src/components/grid/b-custom-data-grid/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCustomDataGrid} content={data} defaults={defaults} />
        <Playground component={BCustomDataGrid} content={data} defaults={defaults} />
        <PropsViewer component={BCustomDataGrid} content={data} defaults={defaults} />
      </div>);
  };