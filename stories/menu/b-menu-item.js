
  import React from 'react';
  import { BMenuItem } from '../../src/components/menu/b-menu-item';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-menu-item/docs/content.json');
  const defaults = require('../../src/components/menu/b-menu-item/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BMenuItem} content={data} defaults={defaults} />
        <Playground component={BMenuItem} content={data} defaults={defaults} />
        <PropsViewer component={BMenuItem} content={data} defaults={defaults} />
      </div>);
  };