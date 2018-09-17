
  import React from 'react';
  import { BStepper } from '../../src/components/layout/b-stepper';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/layout/b-stepper/docs/content.json');
  const defaults = require('../../src/components/layout/b-stepper/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BStepper} content={data} defaults={defaults} />
        <Playground component={BStepper} content={data} defaults={defaults} />
        <PropsViewer component={BStepper} content={data} defaults={defaults} />
      </div>);
  };