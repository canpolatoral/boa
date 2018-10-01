
  import React from 'react';
  import { BDivider } from '../../src/components/others/b-divider';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-divider/docs/content.json');
  const defaults = require('../../src/components/others/b-divider/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDivider} content={data} defaults={defaults} />
        <Playground {...props} component={BDivider} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDivider} content={data} defaults={defaults} />
      </div>);
  };