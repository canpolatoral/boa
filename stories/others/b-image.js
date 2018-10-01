
  import React from 'react';
  import { BImage } from '../../src/components/others/b-image';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-image/docs/content.json');
  const defaults = require('../../src/components/others/b-image/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BImage} content={data} defaults={defaults} />
        <Playground {...props} component={BImage} content={data} defaults={defaults} />
        <PropsTable {...props} component={BImage} content={data} defaults={defaults} />
      </div>);
  };