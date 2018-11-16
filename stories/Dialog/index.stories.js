/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Dialog from './dialog';


const stories = storiesOf('Dialog', module);

stories.add('Dialog', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Dialog {...props} />
    </div>
  );
});
