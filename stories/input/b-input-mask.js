
  import React from 'react';
  import { BInputMask } from '../../src/components/input/b-input-mask';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/input/b-input-mask/docs/content.json');
  const defaults = require('../../src/components/input/b-input-mask/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BInputMask} content={data} defaults={defaults} />
        <Playground {...props} component={BInputMask} content={data} defaults={defaults} />
        <PropsTable {...props} component={BInputMask} content={data} defaults={defaults} />
      </div>);
  };
