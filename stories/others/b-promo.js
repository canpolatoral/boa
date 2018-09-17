
  import React from 'react';
  import { BPromo } from '../../src/components/others/b-promo';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-promo/docs/content.json');
  const defaults = require('../../src/components/others/b-promo/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BPromo} content={data} defaults={defaults} />
        <Playground component={BPromo} content={data} defaults={defaults} />
        <PropsViewer component={BPromo} content={data} defaults={defaults} />
      </div>);
  };