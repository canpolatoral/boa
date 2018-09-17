
  import React from 'react';
  import { BActionManager } from '../../src/components/form/b-action-manager';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/form/b-action-manager/docs/content.json');
  const defaults = require('../../src/components/form/b-action-manager/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BActionManager} content={data} defaults={defaults} />
        <Playground component={BActionManager} content={data} defaults={defaults} />
        <PropsViewer component={BActionManager} content={data} defaults={defaults} />
      </div>);
  };