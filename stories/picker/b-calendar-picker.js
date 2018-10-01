
  import React from 'react';
  import { BCalendarPicker } from '../../src/components/picker/b-calendar-picker';

  import PropsTable from '../base/props-table';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/picker/b-calendar-picker/docs/content.json');
  const defaults = require('../../src/components/picker/b-calendar-picker/assets/data/defaults.json');

  export default ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo {...props} component={BCalendarPicker} content={data} defaults={defaults} />
        <Playground {...props} component={BCalendarPicker} content={data} defaults={defaults} />
        <PropsTable {...props} component={BCalendarPicker} content={data} defaults={defaults} />
      </div>);
  };