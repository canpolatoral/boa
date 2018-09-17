
  import React from 'react';
  import { BLoading } from '../../src/components/others/b-loading';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-loading/docs/content.json');
  const defaults = require('../../src/components/others/b-loading/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BLoading} content={data} defaults={defaults} />
        <Playground component={BLoading} content={data} defaults={defaults} />
        <PropsViewer component={BLoading} content={data} defaults={defaults} />
      </div>);
  };