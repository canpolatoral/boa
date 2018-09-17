
  import React from 'react';
  import { BTreeViewGrid } from '../../src/components/treeview/b-treeview-grid';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/treeview/b-treeview-grid/docs/content.json');
  const defaults = require('../../src/components/treeview/b-treeview-grid/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BTreeViewGrid} content={data} defaults={defaults} />
        <Playground component={BTreeViewGrid} content={data} defaults={defaults} />
        <PropsViewer component={BTreeViewGrid} content={data} defaults={defaults} />
      </div>);
  };