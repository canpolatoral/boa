
  import React from 'react';
  import { BDrawerMenu } from '../../src/components/menu/b-drawer-menu';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-drawer-menu/docs/content.json');
  const defaults = require('../../src/components/menu/b-drawer-menu/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDrawerMenu} content={data} defaults={defaults} />
        <Playground component={BDrawerMenu} content={data} defaults={defaults} />
        <PropsViewer component={BDrawerMenu} content={data} defaults={defaults} />
      </div>);
  };