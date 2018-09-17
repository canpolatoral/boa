
  import React from 'react';
  import { BDateTimePicker } from '../../src/components/picker/b-datetime-picker';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/picker/b-datetime-picker/docs/content.json');
  const defaults = require('../../src/components/picker/b-datetime-picker/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BDateTimePicker} content={data} defaults={defaults} />
        <Playground component={BDateTimePicker} content={data} defaults={defaults} />
        <PropsViewer component={BDateTimePicker} content={data} defaults={defaults} />
      </div>);
  };
