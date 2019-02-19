/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Input } from '@boa/components/Input';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';
import defaultPros from './defaults';

const stories = storiesOf('Inputs', module);

stories.add('Input', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={Input} doc={doc} />
      <Preview {...props} defaultProps={defaultPros} component={Input} doc={doc} />
      <Props {...props} component={Input} doc={doc} />
    </div>
  );
});
