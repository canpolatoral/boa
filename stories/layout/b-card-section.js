
  import React from 'react';
  import { BCardSection } from '../../src/components/layout/b-card-section';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-card-section/docs/content.json');
  const defaults = require('../../src/components/layout/b-card-section/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCardSection} content={data} defaults={defaults} />
        <Playground component={BCardSection} content={data} defaults={defaults} />
        <PropsViewer component={BCardSection} content={data} defaults={defaults} />
      </div>);
  };