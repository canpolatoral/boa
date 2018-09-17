
  import React from 'react';
  import { BIconMenu } from '../../src/components/menu/b-icon-menu';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-icon-menu/docs/content.json');
  const defaults = require('../../src/components/menu/b-icon-menu/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BIconMenu} content={data} defaults={defaults} />
        <Playground component={BIconMenu} content={data} defaults={defaults} />
        <PropsViewer component={BIconMenu} content={data} defaults={defaults} />
      </div>);
  };