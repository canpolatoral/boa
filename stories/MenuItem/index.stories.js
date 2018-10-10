
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { MenuItem } from '../../src/components/MenuItem';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('MenuItem', module);

  stories.add('MenuItem', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={MenuItem} doc={doc} />
        <Preview {...props} component={MenuItem} doc={doc} />
        <Props {...props} component={MenuItem} doc={doc} />
      </div>);
  });
  