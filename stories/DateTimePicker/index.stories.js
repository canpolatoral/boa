
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { DateTimePicker } from '../../src/components/DateTimePicker';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('DateTimePicker', module);

  stories.add('DateTimePicker', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={DateTimePicker} doc={doc} />
        <Preview {...props} component={DateTimePicker} doc={doc} />
        <Props {...props} component={DateTimePicker} doc={doc} />
      </div>);
  });
  