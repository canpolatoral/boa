
  import React from 'react';
  import { BTabBar } from '../../src/components/toolbar/b-tab-bar';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/toolbar/b-tab-bar/docs/content.json');
  const defaults = require('../../src/components/toolbar/b-tab-bar/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BTabBar} content={data} defaults={defaults} />
        <Playground component={BTabBar} content={data} defaults={defaults} />
        <PropsViewer component={BTabBar} content={data} defaults={defaults} />
      </div>);
  };