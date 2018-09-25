
  import React from 'react';
  import { BInputNumeric } from '../../src/components/input/b-input-numeric';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-numeric/docs/content.json');
  const defaults = require('../../src/components/input/b-input-numeric/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BInputNumeric} content={data} defaults={defaults} />
        <Playground {...props} component={BInputNumeric} content={data} defaults={defaults} />
        <PropsTable {...props} component={BInputNumeric} content={data} defaults={defaults} />
      </div>);
  };
