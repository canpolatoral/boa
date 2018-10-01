
  import React from 'react';
  import { BDocViewer } from '../../src/components/documentation/b-doc-viewer';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-viewer/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-viewer/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDocViewer} content={data} defaults={defaults} />
        <Playground {...props} component={BDocViewer} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDocViewer} content={data} defaults={defaults} />
      </div>);
  };