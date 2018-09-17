
  import React from 'react';
  import { BBaseForm } from '../../src/components/form/b-base-form';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/form/b-base-form/docs/content.json');
  const defaults = require('../../src/components/form/b-base-form/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BBaseForm} content={data} defaults={defaults} />
        <Playground component={BBaseForm} content={data} defaults={defaults} />
        <PropsViewer component={BBaseForm} content={data} defaults={defaults} />
      </div>);
  };