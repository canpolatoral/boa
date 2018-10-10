
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { LinearPanel } from '../../src/components/LinearPanel';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('LinearPanel', module);

  stories.add('LinearPanel', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={LinearPanel} doc={doc} />
        <Preview {...props} component={LinearPanel} doc={doc} />
        <Props {...props} component={LinearPanel} doc={doc} />
      </div>);
  });
  