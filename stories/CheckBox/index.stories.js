/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { CheckBox } from '../../src/components/CheckBox';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('CheckBox', module);

stories.add('CheckBox', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={CheckBox} doc={doc} />
      <Preview {...props} component={CheckBox} doc={doc} />
      <Props {...props} component={CheckBox} doc={doc} />
    </div>
  );
});
