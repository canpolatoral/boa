
  import React from 'react';
  import { BIconButton } from '../../src/components/button/b-icon-button';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/button/b-icon-button/docs/content.json');
  const defaults = require('../../src/components/button/b-icon-button/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BIconButton} content={data} defaults={defaults} />
        <Playground component={BIconButton} content={data} defaults={defaults} />
        <PropsViewer component={BIconButton} content={data} defaults={defaults} />
      </div>);
  };