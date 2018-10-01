
  import React from 'react';
  import { BDocNotice } from '../../src/components/documentation/b-doc-notice';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-notice/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-notice/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDocNotice} content={data} defaults={defaults} />
        <Playground {...props} component={BDocNotice} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDocNotice} content={data} defaults={defaults} />
      </div>);
  };