/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { InputAction } from '@boa/components/InputAction';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

const stories = storiesOf('Inputs', module);

stories.add('InputAction', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={InputAction} doc={doc} />
      <Preview {...props} component={InputAction} doc={doc} />
      <Props {...props} component={InputAction} doc={doc} />
    </div>
  );
});
