
  import React from 'react';
  import { BMoreText } from '../../src/components/label/b-more-text';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/label/b-more-text/docs/content.json');
  const defaults = require('../../src/components/label/b-more-text/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BMoreText} content={data} defaults={defaults} />
        <Playground component={BMoreText} content={data} defaults={defaults} />
        <PropsViewer component={BMoreText} content={data} defaults={defaults} />
      </div>);
  };