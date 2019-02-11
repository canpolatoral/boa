/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { InputMask } from '@boa/components/InputMask';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

const stories = storiesOf('Inputs', module);

stories.add('InputMask', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={InputMask} doc={doc} />
      <Preview {...props} component={InputMask} doc={doc} />
      <Props {...props} component={InputMask} doc={doc} />
    </div>
  );
});
