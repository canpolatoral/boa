
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { InputMask } from '../../src/components/InputMask';

  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('InputMask', module);

  stories.add('InputMask', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={InputMask} doc={doc} />
        <Preview {...props} component={InputMask} doc={doc} />
        <Props {...props} component={InputMask} doc={doc} />
      </div>);
  });
  