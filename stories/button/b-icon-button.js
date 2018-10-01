
  import React from 'react';
  import { BIconButton } from '../../src/components/button/b-icon-button';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/button/b-icon-button/docs/content.json');
  const defaults = require('../../src/components/button/b-icon-button/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BIconButton} content={data} defaults={defaults} />
        <Playground {...props} component={BIconButton} content={data} defaults={defaults} />
        <PropsTable {...props} component={BIconButton} content={data} defaults={defaults} />
      </div>);
  };