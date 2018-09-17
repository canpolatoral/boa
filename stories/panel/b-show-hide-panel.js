
  import React from 'react';
  import { BShowHidePanel } from '../../src/components/panel/b-show-hide-panel';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-show-hide-panel/docs/content.json');
  const defaults = require('../../src/components/panel/b-show-hide-panel/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BShowHidePanel} content={data} defaults={defaults} />
        <Playground component={BShowHidePanel} content={data} defaults={defaults} />
        <PropsViewer component={BShowHidePanel} content={data} defaults={defaults} />
      </div>);
  };