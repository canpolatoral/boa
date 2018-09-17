
  import React from 'react';
  import { BCardHeader } from '../../src/components/panel/b-card-header';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-card-header/docs/content.json');
  const defaults = require('../../src/components/panel/b-card-header/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCardHeader} content={data} defaults={defaults} />
        <Playground component={BCardHeader} content={data} defaults={defaults} />
        <PropsViewer component={BCardHeader} content={data} defaults={defaults} />
      </div>);
  };