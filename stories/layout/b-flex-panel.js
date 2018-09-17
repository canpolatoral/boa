
  import React from 'react';
  import { BFlexPanel } from '../../src/components/layout/b-flex-panel';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-flex-panel/docs/content.json');
  const defaults = require('../../src/components/layout/b-flex-panel/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BFlexPanel} content={data} defaults={defaults} />
        <Playground component={BFlexPanel} content={data} defaults={defaults} />
        <PropsViewer component={BFlexPanel} content={data} defaults={defaults} />
      </div>);
  };