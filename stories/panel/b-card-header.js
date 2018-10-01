
  import React from 'react';
  import { BCardHeader } from '../../src/components/panel/b-card-header';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/panel/b-card-header/docs/content.json');
  const defaults = require('../../src/components/panel/b-card-header/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BCardHeader} content={data} defaults={defaults} />
        <Playground {...props} component={BCardHeader} content={data} defaults={defaults} />
        <PropsTable {...props} component={BCardHeader} content={data} defaults={defaults} />
      </div>);
  };