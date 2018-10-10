
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { TreeView } from '../../src/components/TreeView';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('TreeView', module);

  stories.add('TreeView', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={TreeView} doc={doc} />
        <Preview {...props} component={TreeView} doc={doc} />
        <Props {...props} component={TreeView} doc={doc} />
      </div>);
  });
  