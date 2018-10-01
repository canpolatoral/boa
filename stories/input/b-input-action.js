
  import React from 'react';
  import { BInputAction } from '../../src/components/input/b-input-action';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-action/docs/content.json');
  const defaults = require('../../src/components/input/b-input-action/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BInputAction} content={data} defaults={defaults} />
        <Playground {...props} component={BInputAction} content={data} defaults={defaults} />
        <PropsTable {...props} component={BInputAction} content={data} defaults={defaults} />
      </div>);
  };