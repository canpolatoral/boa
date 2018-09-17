
  import React from 'react';
  import { BDocToc } from '../../src/components/documentation/b-doc-toc';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-toc/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-toc/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocToc} content={data} defaults={defaults} />
        <Playground component={BDocToc} content={data} defaults={defaults} />
        <PropsViewer component={BDocToc} content={data} defaults={defaults} />
      </div>);
  };