
  import React from 'react';
  import { BInformationText } from '../../src/components/label/b-information-text';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/label/b-information-text/docs/content.json');
  const defaults = require('../../src/components/label/b-information-text/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BInformationText} content={data} defaults={defaults} />
        <Playground component={BInformationText} content={data} defaults={defaults} />
        <PropsViewer component={BInformationText} content={data} defaults={defaults} />
      </div>);
  };