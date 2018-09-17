
  import React from 'react';
  import { BIconInput } from '../../src/components/dms/b-icon-input';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/dms/b-icon-input/docs/content.json');
  const defaults = require('../../src/components/dms/b-icon-input/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BIconInput} content={data} defaults={defaults} />
        <Playground component={BIconInput} content={data} defaults={defaults} />
        <PropsViewer component={BIconInput} content={data} defaults={defaults} />
      </div>);
  };