
  import React from 'react';
  import { BUserProfile } from '../../src/components/toolbar/b-user-profile';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/toolbar/b-user-profile/docs/content.json');
  const defaults = require('../../src/components/toolbar/b-user-profile/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BUserProfile} content={data} defaults={defaults} />
        <Playground component={BUserProfile} content={data} defaults={defaults} />
        <PropsViewer component={BUserProfile} content={data} defaults={defaults} />
      </div>);
  };