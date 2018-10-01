
  import React from 'react';
  import { BDocToc } from '../../src/components/documentation/b-doc-toc';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-toc/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-toc/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDocToc} content={data} defaults={defaults} />
        <Playground {...props} component={BDocToc} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDocToc} content={data} defaults={defaults} />
      </div>);
  };