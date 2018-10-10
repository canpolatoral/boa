
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Divider } from '../../src/components/Divider';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Divider', module);

  stories.add('Divider', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Divider} doc={doc} />
        <Preview {...props} component={Divider} doc={doc} />
        <Props {...props} component={Divider} doc={doc} />
      </div>);
  });
  