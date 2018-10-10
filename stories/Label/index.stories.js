
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Label } from '../../src/components/Label';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Label', module);

  stories.add('Label', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Label} doc={doc} />
        <Preview {...props} component={Label} doc={doc} />
        <Props {...props} component={Label} doc={doc} />
      </div>);
  });
  