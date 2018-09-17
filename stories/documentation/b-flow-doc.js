
  import React from 'react';
  import { BFlowDoc } from '../../src/components/documentation/b-flow-doc';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-flow-doc/docs/content.json');
  const defaults = require('../../src/components/documentation/b-flow-doc/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BFlowDoc} content={data} defaults={defaults} />
        <Playground component={BFlowDoc} content={data} defaults={defaults} />
        <PropsViewer component={BFlowDoc} content={data} defaults={defaults} />
      </div>);
  };