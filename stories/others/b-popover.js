
  import React from 'react';
  import { BPopover } from '../../src/components/others/b-popover';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-popover/docs/content.json');
  const defaults = require('../../src/components/others/b-popover/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BPopover} content={data} defaults={defaults} />
        <Playground component={BPopover} content={data} defaults={defaults} />
        <PropsViewer component={BPopover} content={data} defaults={defaults} />
      </div>);
  };