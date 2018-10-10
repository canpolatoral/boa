
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Dialog } from '../../src/components/Dialog';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Dialog', module);

  stories.add('Dialog', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Dialog} doc={doc} />
        <Preview {...props} component={Dialog} doc={doc} />
        <Props {...props} component={Dialog} doc={doc} />
      </div>);
  });
  