
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Input } from '../../src/components/Input';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Input', module);

  stories.add('Input', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Input} doc={doc} />
        <Preview {...props} component={Input} doc={doc} />
        <Props {...props} component={Input} doc={doc} />
      </div>);
  });
  