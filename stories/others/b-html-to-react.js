
  import React from 'react';
  import { BHtmlToReact } from '../../src/components/others/b-html-to-react';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/others/b-html-to-react/docs/content.json');
  const defaults = require('../../src/components/others/b-html-to-react/assets/data/defaults.json');

  export default () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BHtmlToReact} content={data} defaults={defaults} />
        <Playground component={BHtmlToReact} content={data} defaults={defaults} />
        <PropsViewer component={BHtmlToReact} content={data} defaults={defaults} />
      </div>);
  };