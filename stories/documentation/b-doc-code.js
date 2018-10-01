
  import React from 'react';
  import { BDocCode } from '../../src/components/documentation/b-doc-code';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-code/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-code/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDocCode} content={data} defaults={defaults} />
        <Playground {...props} component={BDocCode} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDocCode} content={data} defaults={defaults} />
      </div>);
  };