
  import React from 'react';
  import { BActionManagerInfo } from '../../src/components/form/b-action-manager-info';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/form/b-action-manager-info/docs/content.json');
  const defaults = require('../../src/components/form/b-action-manager-info/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BActionManagerInfo} content={data} defaults={defaults} />
        <Playground component={BActionManagerInfo} content={data} defaults={defaults} />
        <PropsViewer component={BActionManagerInfo} content={data} defaults={defaults} />
      </div>);
  };