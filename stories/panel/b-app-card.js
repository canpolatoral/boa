
  import React from 'react';
  import { BAppCard } from '../../src/components/panel/b-app-card';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-app-card/docs/content.json');
  const defaults = require('../../src/components/panel/b-app-card/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BAppCard} content={data} defaults={defaults} />
        <Playground component={BAppCard} content={data} defaults={defaults} />
        <PropsViewer component={BAppCard} content={data} defaults={defaults} />
      </div>);
  };