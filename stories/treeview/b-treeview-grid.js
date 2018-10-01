
  import React from 'react';
  import { BTreeViewGrid } from '../../src/components/treeview/b-treeview-grid';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/treeview/b-treeview-grid/docs/content.json');
  const defaults = require('../../src/components/treeview/b-treeview-grid/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BTreeViewGrid} content={data} defaults={defaults} />
        <Playground {...props} component={BTreeViewGrid} content={data} defaults={defaults} />
        <PropsTable {...props} component={BTreeViewGrid} content={data} defaults={defaults} />
      </div>);
  };