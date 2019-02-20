/* eslint-disable max-len, react/prop-types */
import React from 'react';
import { Input } from '@boa/components/Input';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';
import defaultProps from './default';

export default ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={Input} doc={doc} />
      <Preview {...props} defaultProps={defaultProps(props.context)} component={Input} doc={doc} />
      <Props {...props} component={Input} doc={doc} />
    </div>
  );
};
