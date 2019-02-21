/* eslint-disable max-len, react/prop-types */
import React from 'react';
import { Menu } from '@kuveytturk/boa-components/Menu';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';
import defaultProps from './default';

export default ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={Menu} doc={doc} />
      <Preview {...props} component={Menu} doc={doc} defaultProps={defaultProps} />
      <Props {...props} component={Menu} doc={doc} />
    </div>
  );
};
