
  import React from 'react';
  import { BGridList } from '../../src/components/list/b-grid-list';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/list/b-grid-list/docs/content.json');
  const defaults = require('../../src/components/list/b-grid-list/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BGridList} content={data} defaults={defaults} />
        <Playground component={BGridList} content={data} defaults={defaults} />
        <PropsViewer component={BGridList} content={data} defaults={defaults} />
      </div>);
  };