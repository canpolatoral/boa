
  import React from 'react';
  import { BListItem } from '../../src/components/list/b-list-item';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/list/b-list-item/docs/content.json');
  const defaults = require('../../src/components/list/b-list-item/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BListItem} content={data} defaults={defaults} />
        <Playground component={BListItem} content={data} defaults={defaults} />
        <PropsViewer component={BListItem} content={data} defaults={defaults} />
      </div>);
  };