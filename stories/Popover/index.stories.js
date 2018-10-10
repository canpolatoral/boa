
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Popover } from '../../src/components/Popover';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Popover', module);

  stories.add('Popover', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Popover} doc={doc} />
        <Preview {...props} component={Popover} doc={doc} />
        <Props {...props} component={Popover} doc={doc} />
      </div>);
  });
  