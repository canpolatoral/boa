
  import React from 'react';
  import { BSpan } from '../../src/components/label/b-span';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/label/b-span/docs/content.json');
  const defaults = require('../../src/components/label/b-span/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BSpan} content={data} defaults={defaults} />
        <Playground component={BSpan} content={data} defaults={defaults} />
        <PropsViewer component={BSpan} content={data} defaults={defaults} />
      </div>);
  };