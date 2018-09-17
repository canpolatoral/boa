
  import React from 'react';
  import { BImage } from '../../src/components/others/b-image';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-image/docs/content.json');
  const defaults = require('../../src/components/others/b-image/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BImage} content={data} defaults={defaults} />
        <Playground component={BImage} content={data} defaults={defaults} />
        <PropsViewer component={BImage} content={data} defaults={defaults} />
      </div>);
  };