
  import React from 'react';
  import { BInputNumeric } from '../../src/components/input/b-input-numeric';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-numeric/docs/content.json');
  const defaults = require('../../src/components/input/b-input-numeric/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInputNumeric} content={data} defaults={defaults} />
        <Playground component={BInputNumeric} content={data} defaults={defaults} />
        <PropsViewer component={BInputNumeric} content={data} defaults={defaults} />
      </div>);
  };