
  import React from 'react';
  import { BResizable } from '../../src/components/layout/b-resizable';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-resizable/docs/content.json');
  const defaults = require('../../src/components/layout/b-resizable/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BResizable} content={data} defaults={defaults} />
        <Playground component={BResizable} content={data} defaults={defaults} />
        <PropsViewer component={BResizable} content={data} defaults={defaults} />
      </div>);
  };