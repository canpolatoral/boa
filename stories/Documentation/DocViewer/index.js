/* eslint-disable max-len */
import React from 'react';
import { DocViewer } from '@boa/components/DocViewer';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

// eslint-disable-next-line
export default ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={DocViewer} doc={doc} />
      <Preview {...props} component={DocViewer} doc={doc} />
      <Props {...props} component={DocViewer} doc={doc} />
    </div>
  );
};
