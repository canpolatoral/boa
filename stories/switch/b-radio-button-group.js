
  import React from 'react';
  import { BRadioButtonGroup } from '../../src/components/switch/b-radio-button-group';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-radio-button-group/docs/content.json');
  const defaults = require('../../src/components/switch/b-radio-button-group/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BRadioButtonGroup} content={data} defaults={defaults} />
        <Playground {...props} component={BRadioButtonGroup} content={data} defaults={defaults} />
        <PropsTable {...props} component={BRadioButtonGroup} content={data} defaults={defaults} />
      </div>);
  };