
  import React from 'react';
  import { BCheckBoxGroup } from '../../src/components/switch/b-check-box-group';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-check-box-group/docs/content.json');
  const defaults = require('../../src/components/switch/b-check-box-group/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCheckBoxGroup} content={data} defaults={defaults} />
        <Playground component={BCheckBoxGroup} content={data} defaults={defaults} />
        <PropsViewer component={BCheckBoxGroup} content={data} defaults={defaults} />
      </div>);
  };