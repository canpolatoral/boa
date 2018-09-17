
  import React from 'react';
  import { BGridSection } from '../../src/components/layout/b-grid-section';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-grid-section/docs/content.json');
  const defaults = require('../../src/components/layout/b-grid-section/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BGridSection} content={data} defaults={defaults} />
        <Playground component={BGridSection} content={data} defaults={defaults} />
        <PropsViewer component={BGridSection} content={data} defaults={defaults} />
      </div>);
  };