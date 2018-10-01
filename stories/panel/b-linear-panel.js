
  import React from 'react';
  import { BLinearPanel } from '../../src/components/panel/b-linear-panel';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-linear-panel/docs/content.json');
  const defaults = require('../../src/components/panel/b-linear-panel/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BLinearPanel} content={data} defaults={defaults} />
        <Playground {...props} component={BLinearPanel} content={data} defaults={defaults} />
        <PropsTable {...props} component={BLinearPanel} content={data} defaults={defaults} />
      </div>);
  };