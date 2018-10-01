
  import React from 'react';
  import { BTabBar } from '../../src/components/toolbar/b-tab-bar';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/toolbar/b-tab-bar/docs/content.json');
  const defaults = require('../../src/components/toolbar/b-tab-bar/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BTabBar} content={data} defaults={defaults} />
        <Playground {...props} component={BTabBar} content={data} defaults={defaults} />
        <PropsTable {...props} component={BTabBar} content={data} defaults={defaults} />
      </div>);
  };