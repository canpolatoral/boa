
  import React from 'react';
  import { BInputMask } from '../../src/components/input/b-input-mask';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-mask/docs/content.json');
  const defaults = require('../../src/components/input/b-input-mask/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInputMask} content={data} defaults={defaults} />
        <Playground component={BInputMask} content={data} defaults={defaults} />
        <PropsViewer component={BInputMask} content={data} defaults={defaults} />
      </div>);
  };