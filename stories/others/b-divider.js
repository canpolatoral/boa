
  import React from 'react';
  import { BDivider } from '../../src/components/others/b-divider';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-divider/docs/content.json');
  const defaults = require('../../src/components/others/b-divider/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDivider} content={data} defaults={defaults} />
        <Playground component={BDivider} content={data} defaults={defaults} />
        <PropsViewer component={BDivider} content={data} defaults={defaults} />
      </div>);
  };