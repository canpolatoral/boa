
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { Menu } from '../../src/components/Menu';

  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('Menu', module);

  stories.add('Menu', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Menu} doc={doc} />
        <Preview {...props} component={Menu} doc={doc} />
        <Props {...props} component={Menu} doc={doc} />
      </div>);
  });
  