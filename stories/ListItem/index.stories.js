
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { ListItem } from '../../src/components/ListItem';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('ListItem', module);

  stories.add('ListItem', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={ListItem} doc={doc} />
        <Preview {...props} component={ListItem} doc={doc} />
        <Props {...props} component={ListItem} doc={doc} />
      </div>);
  });
  