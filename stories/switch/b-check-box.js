
  import React from 'react';
  import { BCheckBox } from '../../src/components/switch/b-check-box';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-check-box/docs/content.json');
  const defaults = require('../../src/components/switch/b-check-box/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCheckBox} content={data} defaults={defaults} />
        <Playground component={BCheckBox} content={data} defaults={defaults} />
        <PropsViewer component={BCheckBox} content={data} defaults={defaults} />
      </div>);
  };