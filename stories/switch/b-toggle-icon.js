
  import React from 'react';
  import { BToggleIcon } from '../../src/components/switch/b-toggle-icon';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-toggle-icon/docs/content.json');
  const defaults = require('../../src/components/switch/b-toggle-icon/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BToggleIcon} content={data} defaults={defaults} />
        <Playground component={BToggleIcon} content={data} defaults={defaults} />
        <PropsViewer component={BToggleIcon} content={data} defaults={defaults} />
      </div>);
  };