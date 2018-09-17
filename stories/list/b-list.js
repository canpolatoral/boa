
  import React from 'react';
  import { BList } from '../../src/components/list/b-list';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/list/b-list/docs/content.json');
  const defaults = require('../../src/components/list/b-list/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BList} content={data} defaults={defaults} />
        <Playground component={BList} content={data} defaults={defaults} />
        <PropsViewer component={BList} content={data} defaults={defaults} />
      </div>);
  };