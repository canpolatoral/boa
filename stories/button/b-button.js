
  import React from 'react';
  import { BButton } from '../../src/components/button/b-button';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/button/b-button/docs/content.json');
  const defaults = require('../../src/components/button/b-button/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BButton} content={data} defaults={defaults} />
        <Playground {...props} component={BButton} content={data} defaults={defaults} />
        <PropsTable {...props} component={BButton} content={data} defaults={defaults} />
      </div>);
  };
