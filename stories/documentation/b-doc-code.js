
  import React from 'react';
  import { BDocCode } from '../../src/components/documentation/b-doc-code';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-code/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-code/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocCode} content={data} defaults={defaults} />
        <Playground component={BDocCode} content={data} defaults={defaults} />
        <PropsViewer component={BDocCode} content={data} defaults={defaults} />
      </div>);
  };