
  import React from 'react';
  import { BContentLoader } from '../../src/components/others/b-content-loader';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-content-loader/docs/content.json');
  const defaults = require('../../src/components/others/b-content-loader/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BContentLoader} content={data} defaults={defaults} />
        <Playground component={BContentLoader} content={data} defaults={defaults} />
        <PropsViewer component={BContentLoader} content={data} defaults={defaults} />
      </div>);
  };