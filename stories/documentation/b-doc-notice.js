
  import React from 'react';
  import { BDocNotice } from '../../src/components/documentation/b-doc-notice';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-notice/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-notice/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocNotice} content={data} defaults={defaults} />
        <Playground component={BDocNotice} content={data} defaults={defaults} />
        <PropsViewer component={BDocNotice} content={data} defaults={defaults} />
      </div>);
  };