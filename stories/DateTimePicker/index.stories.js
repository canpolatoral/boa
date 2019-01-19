/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { DateTimePicker } from '@boa/components/DateTimePicker';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('DateTimePicker', module);

stories.add('DateTimePicker', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={DateTimePicker} doc={doc} />
      <Preview {...props} component={DateTimePicker} doc={doc} />
      <Props {...props} component={DateTimePicker} doc={doc} />
    </div>
  );
});
