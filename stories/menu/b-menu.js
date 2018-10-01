
  import React from 'react';
  import { BMenu } from '../../src/components/menu/b-menu';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-menu/docs/content.json');
  const defaults = require('../../src/components/menu/b-menu/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BMenu} content={data} defaults={defaults} />
        <Playground {...props} component={BMenu} content={data} defaults={defaults} />
        <PropsTable {...props} component={BMenu} content={data} defaults={defaults} />
      </div>);
  };