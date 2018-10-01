
  import React from 'react';
  import { BPopover } from '../../src/components/others/b-popover';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-popover/docs/content.json');
  const defaults = require('../../src/components/others/b-popover/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BPopover} content={data} defaults={defaults} />
        <Playground {...props} component={BPopover} content={data} defaults={defaults} />
        <PropsTable {...props} component={BPopover} content={data} defaults={defaults} />
      </div>);
  };