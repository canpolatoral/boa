
  import React from 'react';
  import { BFooter } from '../../src/components/layout/b-footer';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-footer/docs/content.json');
  const defaults = require('../../src/components/layout/b-footer/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BFooter} content={data} defaults={defaults} />
        <Playground component={BFooter} content={data} defaults={defaults} />
        <PropsViewer component={BFooter} content={data} defaults={defaults} />
      </div>);
  };