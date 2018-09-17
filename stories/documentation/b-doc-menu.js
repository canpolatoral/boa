
  import React from 'react';
  import { BDocMenu } from '../../src/components/documentation/b-doc-menu';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/documentation/b-doc-menu/docs/content.json');
  const defaults = require('../../src/components/documentation/b-doc-menu/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDocMenu} content={data} defaults={defaults} />
        <Playground component={BDocMenu} content={data} defaults={defaults} />
        <PropsViewer component={BDocMenu} content={data} defaults={defaults} />
      </div>);
  };