
  import React from 'react';
  import { BMenu } from '../../src/components/menu/b-menu';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-menu/docs/content.json');
  const defaults = require('../../src/components/menu/b-menu/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BMenu} content={data} defaults={defaults} />
        <Playground component={BMenu} content={data} defaults={defaults} />
        <PropsViewer component={BMenu} content={data} defaults={defaults} />
      </div>);
  };