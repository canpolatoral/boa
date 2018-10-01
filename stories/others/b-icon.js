
  import React from 'react';
  import { BIcon } from '../../src/components/others/b-icon';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-icon/docs/content.json');
  const defaults = require('../../src/components/others/b-icon/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BIcon} content={data} defaults={defaults} />
        <Playground {...props} component={BIcon} content={data} defaults={defaults} />
        <PropsTable {...props} component={BIcon} content={data} defaults={defaults} />
      </div>);
  };