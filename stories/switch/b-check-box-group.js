
  import React from 'react';
  import { BCheckBoxGroup } from '../../src/components/switch/b-check-box-group';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-check-box-group/docs/content.json');
  const defaults = require('../../src/components/switch/b-check-box-group/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BCheckBoxGroup} content={data} defaults={defaults} />
        <Playground {...props} component={BCheckBoxGroup} content={data} defaults={defaults} />
        <PropsTable {...props} component={BCheckBoxGroup} content={data} defaults={defaults} />
      </div>);
  };