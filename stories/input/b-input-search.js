
  import React from 'react';
  import { BInputSearch } from '../../src/components/input/b-input-search';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-search/docs/content.json');
  const defaults = require('../../src/components/input/b-input-search/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BInputSearch} content={data} defaults={defaults} />
        <Playground {...props} component={BInputSearch} content={data} defaults={defaults} />
        <PropsTable {...props} component={BInputSearch} content={data} defaults={defaults} />
      </div>);
  };