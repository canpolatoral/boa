
  import React from 'react';
  import { BAutoComplete } from '../../src/components/input/b-auto-complete';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-auto-complete/docs/content.json');
  const defaults = require('../../src/components/input/b-auto-complete/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BAutoComplete} content={data} defaults={defaults} />
        <Playground component={BAutoComplete} content={data} defaults={defaults} />
        <PropsViewer component={BAutoComplete} content={data} defaults={defaults} />
      </div>);
  };