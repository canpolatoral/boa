
  import React from 'react';
  import { BRadioButtonGroup } from '../../src/components/switch/b-radio-button-group';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-radio-button-group/docs/content.json');
  const defaults = require('../../src/components/switch/b-radio-button-group/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BRadioButtonGroup} content={data} defaults={defaults} />
        <Playground component={BRadioButtonGroup} content={data} defaults={defaults} />
        <PropsViewer component={BRadioButtonGroup} content={data} defaults={defaults} />
      </div>);
  };