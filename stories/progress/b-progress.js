
  import React from 'react';
  import { BProgress } from '../../src/components/progress/b-progress';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/progress/b-progress/docs/content.json');
  const defaults = require('../../src/components/progress/b-progress/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BProgress} content={data} defaults={defaults} />
        <Playground component={BProgress} content={data} defaults={defaults} />
        <PropsViewer component={BProgress} content={data} defaults={defaults} />
      </div>);
  };