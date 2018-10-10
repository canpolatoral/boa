
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { TreeViewGrid } from '../../src/components/TreeViewGrid';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('TreeViewGrid', module);

  stories.add('TreeViewGrid', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={TreeViewGrid} doc={doc} />
        <Preview {...props} component={TreeViewGrid} doc={doc} />
        <Props {...props} component={TreeViewGrid} doc={doc} />
      </div>);
  });
  