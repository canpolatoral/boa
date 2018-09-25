
  import React from 'react';
  import { BInput } from '../../src/components/input/b-input';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input/docs/content.json');
  const defaults = require('../../src/components/input/b-input/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BInput} content={data} defaults={defaults} />
        <Playground {...props} component={BInput} content={data} defaults={defaults} />
        <PropsTable {...props} component={BInput} content={data} defaults={defaults} />
      </div>);
  };
