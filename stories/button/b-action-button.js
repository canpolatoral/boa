
  import React from 'react';
  import { BActionButton } from '../../src/components/button/b-action-button';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/button/b-action-button/docs/content.json');
  const defaults = require('../../src/components/button/b-action-button/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BActionButton} content={data} defaults={defaults} />
        <Playground component={BActionButton} content={data} defaults={defaults} />
        <PropsViewer component={BActionButton} content={data} defaults={defaults} />
      </div>);
  };