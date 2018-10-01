
  import React from 'react';
  import { BCheckBox } from '../../src/components/switch/b-check-box';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-check-box/docs/content.json');
  const defaults = require('../../src/components/switch/b-check-box/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BCheckBox} content={data} defaults={defaults} />
        <Playground {...props} component={BCheckBox} content={data} defaults={defaults} />
        <PropsTable {...props} component={BCheckBox} content={data} defaults={defaults} />
      </div>);
  };