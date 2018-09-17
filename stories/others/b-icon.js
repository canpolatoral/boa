
  import React from 'react';
  import { BIcon } from '../../src/components/others/b-icon';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-icon/docs/content.json');
  const defaults = require('../../src/components/others/b-icon/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BIcon} content={data} defaults={defaults} />
        <Playground component={BIcon} content={data} defaults={defaults} />
        <PropsViewer component={BIcon} content={data} defaults={defaults} />
      </div>);
  };