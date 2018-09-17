
  import React from 'react';
  import { BSnackBar } from '../../src/components/others/b-snackbar';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-snackbar/docs/content.json');
  const defaults = require('../../src/components/others/b-snackbar/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BSnackBar} content={data} defaults={defaults} />
        <Playground component={BSnackBar} content={data} defaults={defaults} />
        <PropsViewer component={BSnackBar} content={data} defaults={defaults} />
      </div>);
  };