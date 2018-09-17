
  import React from 'react';
  import { BVirtualizedList } from '../../src/components/list/b-virtualized-list';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/list/b-virtualized-list/docs/content.json');
  const defaults = require('../../src/components/list/b-virtualized-list/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BVirtualizedList} content={data} defaults={defaults} />
        <Playground component={BVirtualizedList} content={data} defaults={defaults} />
        <PropsViewer component={BVirtualizedList} content={data} defaults={defaults} />
      </div>);
  };