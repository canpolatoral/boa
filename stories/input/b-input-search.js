
  import React from 'react';
  import { BInputSearch } from '../../src/components/input/b-input-search';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-search/docs/content.json');
  const defaults = require('../../src/components/input/b-input-search/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInputSearch} content={data} defaults={defaults} />
        <Playground component={BInputSearch} content={data} defaults={defaults} />
        <PropsViewer component={BInputSearch} content={data} defaults={defaults} />
      </div>);
  };