
  import React from 'react';
  import { BAutoComplete } from '../../src/components/input/b-auto-complete';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-auto-complete/docs/content.json');
  const defaults = require('../../src/components/input/b-auto-complete/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BAutoComplete} content={data} defaults={defaults} />
        <Playground {...props} component={BAutoComplete} content={data} defaults={defaults} />
        <PropsTable {...props} component={BAutoComplete} content={data} defaults={defaults} />
      </div>);
  };