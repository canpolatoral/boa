
  import React from 'react';
  import { BPageHost } from '../../src/components/toolbar/b-page-host';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/toolbar/b-page-host/docs/content.json');
  const defaults = require('../../src/components/toolbar/b-page-host/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BPageHost} content={data} defaults={defaults} />
        <Playground component={BPageHost} content={data} defaults={defaults} />
        <PropsViewer component={BPageHost} content={data} defaults={defaults} />
      </div>);
  };