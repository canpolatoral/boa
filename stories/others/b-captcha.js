
  import React from 'react';
  import { BCaptcha } from '../../src/components/others/b-captcha';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-captcha/docs/content.json');
  const defaults = require('../../src/components/others/b-captcha/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BCaptcha} content={data} defaults={defaults} />
        <Playground component={BCaptcha} content={data} defaults={defaults} />
        <PropsViewer component={BCaptcha} content={data} defaults={defaults} />
      </div>);
  };