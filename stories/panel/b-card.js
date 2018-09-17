
  import React from 'react';
  import { BCard } from '../../src/components/panel/b-card';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-card/docs/content.json');
  const defaults = require('../../src/components/panel/b-card/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCard} content={data} defaults={defaults} />
        <Playground component={BCard} content={data} defaults={defaults} />
        <PropsViewer component={BCard} content={data} defaults={defaults} />
      </div>);
  };