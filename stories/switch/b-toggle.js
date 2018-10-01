
  import React from 'react';
  import { BToggle } from '../../src/components/switch/b-toggle';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-toggle/docs/content.json');
  const defaults = require('../../src/components/switch/b-toggle/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BToggle} content={data} defaults={defaults} />
        <Playground {...props} component={BToggle} content={data} defaults={defaults} />
        <PropsTable {...props} component={BToggle} content={data} defaults={defaults} />
      </div>);
  };