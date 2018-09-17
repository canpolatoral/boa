
  import React from 'react';
  import { BResizableBeta } from '../../src/components/layout/b-resizable-beta';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-resizable-beta/docs/content.json');
  const defaults = require('../../src/components/layout/b-resizable-beta/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BResizableBeta} content={data} defaults={defaults} />
        <Playground component={BResizableBeta} content={data} defaults={defaults} />
        <PropsViewer component={BResizableBeta} content={data} defaults={defaults} />
      </div>);
  };