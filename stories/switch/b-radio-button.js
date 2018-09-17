
  import React from 'react';
  import { BRadioButton } from '../../src/components/switch/b-radio-button';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/switch/b-radio-button/docs/content.json');
  const defaults = require('../../src/components/switch/b-radio-button/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BRadioButton} content={data} defaults={defaults} />
        <Playground component={BRadioButton} content={data} defaults={defaults} />
        <PropsViewer component={BRadioButton} content={data} defaults={defaults} />
      </div>);
  };