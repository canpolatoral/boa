
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { TabBar } from '../../src/components/TabBar';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('TabBar', module);

  stories.add('TabBar', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={TabBar} doc={doc} />
        <Preview {...props} component={TabBar} doc={doc} />
        <Props {...props} component={TabBar} doc={doc} />
      </div>);
  });
  