
  import React from 'react';
  import { BToggleIcon } from '../../src/components/switch/b-toggle-icon';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-toggle-icon/docs/content.json');
  const defaults = require('../../src/components/switch/b-toggle-icon/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BToggleIcon} content={data} defaults={defaults} />
        <Playground {...props} component={BToggleIcon} content={data} defaults={defaults} />
        <PropsTable {...props} component={BToggleIcon} content={data} defaults={defaults} />
      </div>);
  };