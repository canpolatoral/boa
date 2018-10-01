
  import React from 'react';
  import { BRadioButton } from '../../src/components/switch/b-radio-button';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-radio-button/docs/content.json');
  const defaults = require('../../src/components/switch/b-radio-button/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BRadioButton} content={data} defaults={defaults} />
        <Playground {...props} component={BRadioButton} content={data} defaults={defaults} />
        <PropsTable {...props} component={BRadioButton} content={data} defaults={defaults} />
      </div>);
  };