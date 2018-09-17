
  import React from 'react';
  import { BCriteriaPanel } from '../../src/components/panel/b-criteria-panel';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-criteria-panel/docs/content.json');
  const defaults = require('../../src/components/panel/b-criteria-panel/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCriteriaPanel} content={data} defaults={defaults} />
        <Playground component={BCriteriaPanel} content={data} defaults={defaults} />
        <PropsViewer component={BCriteriaPanel} content={data} defaults={defaults} />
      </div>);
  };