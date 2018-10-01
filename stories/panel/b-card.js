
  import React from 'react';
  import { BCard } from '../../src/components/panel/b-card';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-card/docs/content.json');
  const defaults = require('../../src/components/panel/b-card/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BCard} content={data} defaults={defaults} />
        <Playground {...props} component={BCard} content={data} defaults={defaults} />
        <PropsTable {...props} component={BCard} content={data} defaults={defaults} />
      </div>);
  };