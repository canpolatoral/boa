
  import React from 'react';
  import { BDocViewer } from '../../src/components/documentation/b-doc-viewer';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-viewer/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-viewer/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocViewer} content={data} defaults={defaults} />
        <Playground component={BDocViewer} content={data} defaults={defaults} />
        <PropsViewer component={BDocViewer} content={data} defaults={defaults} />
      </div>);
  };