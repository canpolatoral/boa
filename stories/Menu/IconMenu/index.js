/* eslint-disable max-len */
import React from 'react';
import { IconMenu } from '@kuveytturk/boa-components/IconMenu';
import Header from '../../base/header';
import PropsTable from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

// eslint-disable-next-line
export default ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={IconMenu} doc={doc} />
      <Preview {...props} component={IconMenu} doc={doc} />
      <PropsTable {...props} component={IconMenu} doc={doc} />
    </div>
  );
};
