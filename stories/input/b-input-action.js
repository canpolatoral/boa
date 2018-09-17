
  import React from 'react';
  import { BInputAction } from '../../src/components/input/b-input-action';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-action/docs/content.json');
  const defaults = require('../../src/components/input/b-input-action/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInputAction} content={data} defaults={defaults} />
        <Playground component={BInputAction} content={data} defaults={defaults} />
        <PropsViewer component={BInputAction} content={data} defaults={defaults} />
      </div>);
  };