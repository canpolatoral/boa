
  import React from 'react';
  import { BMenuItem } from '../../src/components/menu/b-menu-item';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/menu/b-menu-item/docs/content.json');
  const defaults = require('../../src/components/menu/b-menu-item/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BMenuItem} content={data} defaults={defaults} />
        <Playground {...props} component={BMenuItem} content={data} defaults={defaults} />
        <PropsTable {...props} component={BMenuItem} content={data} defaults={defaults} />
      </div>);
  };