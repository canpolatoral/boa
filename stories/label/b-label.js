
  import React from 'react';
  import { BLabel } from '../../src/components/label/b-label';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/label/b-label/docs/content.json');
  const defaults = require('../../src/components/label/b-label/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BLabel} content={data} defaults={defaults} />
        <Playground component={BLabel} content={data} defaults={defaults} />
        <PropsViewer component={BLabel} content={data} defaults={defaults} />
      </div>);
  };