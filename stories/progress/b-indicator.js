
  import React from 'react';
  import { BIndicator } from '../../src/components/progress/b-indicator';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/progress/b-indicator/docs/content.json');
  const defaults = require('../../src/components/progress/b-indicator/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BIndicator} content={data} defaults={defaults} />
        <Playground component={BIndicator} content={data} defaults={defaults} />
        <PropsViewer component={BIndicator} content={data} defaults={defaults} />
      </div>);
  };