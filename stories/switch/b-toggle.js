
  import React from 'react';
  import { BToggle } from '../../src/components/switch/b-toggle';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-toggle/docs/content.json');
  const defaults = require('../../src/components/switch/b-toggle/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BToggle} content={data} defaults={defaults} />
        <Playground component={BToggle} content={data} defaults={defaults} />
        <PropsViewer component={BToggle} content={data} defaults={defaults} />
      </div>);
  };