
  import React from 'react';
  import { BTreeView } from '../../src/components/treeview/b-treeview';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/treeview/b-treeview/docs/content.json');
  const defaults = require('../../src/components/treeview/b-treeview/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BTreeView} content={data} defaults={defaults} />
        <Playground {...props} component={BTreeView} content={data} defaults={defaults} />
        <PropsTable {...props} component={BTreeView} content={data} defaults={defaults} />
      </div>);
  };