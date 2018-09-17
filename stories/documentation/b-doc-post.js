
  import React from 'react';
  import { BDocPost } from '../../src/components/documentation/b-doc-post';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-post/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-post/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocPost} content={data} defaults={defaults} />
        <Playground component={BDocPost} content={data} defaults={defaults} />
        <PropsViewer component={BDocPost} content={data} defaults={defaults} />
      </div>);
  };