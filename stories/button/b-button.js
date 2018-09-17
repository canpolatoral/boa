
  import React from 'react';
  import { BButton } from '../../src/components/button/b-button';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/button/b-button/docs/content.json');
  const defaults = require('../../src/components/button/b-button/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BButton} content={data} defaults={defaults} />
        <Playground component={BButton} content={data} defaults={defaults} />
        <PropsViewer component={BButton} content={data} defaults={defaults} />
      </div>);
  };