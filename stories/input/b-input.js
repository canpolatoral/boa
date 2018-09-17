
  import React from 'react';
  import { BInput } from '../../src/components/input/b-input';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input/docs/content.json');
  const defaults = require('../../src/components/input/b-input/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInput} content={data} defaults={defaults} />
        <Playground component={BInput} content={data} defaults={defaults} />
        <PropsViewer component={BInput} content={data} defaults={defaults} />
      </div>);
  };