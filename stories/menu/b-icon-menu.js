
  import React from 'react';
  import { BIconMenu } from '../../src/components/menu/b-icon-menu';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-icon-menu/docs/content.json');
  const defaults = require('../../src/components/menu/b-icon-menu/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BIconMenu} content={data} defaults={defaults} />
        <Playground {...props} component={BIconMenu} content={data} defaults={defaults} />
        <PropsTable {...props} component={BIconMenu} content={data} defaults={defaults} />
      </div>);
  };