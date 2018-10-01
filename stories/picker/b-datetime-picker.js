
  import React from 'react';
  import { BDateTimePicker } from '../../src/components/picker/b-datetime-picker';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/picker/b-datetime-picker/docs/content.json');
  const defaults = require('../../src/components/picker/b-datetime-picker/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BDateTimePicker} content={data} defaults={defaults} />
        <Playground {...props} component={BDateTimePicker} content={data} defaults={defaults} />
        <PropsTable {...props} component={BDateTimePicker} content={data} defaults={defaults} />
      </div>);
  };