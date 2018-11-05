
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { TreeView } from '../../src/components/TreeView';
  import sampleData from '../../src/components/TreeView/data/sampleData';

  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('TreeView', module);

  stories.add('TreeView', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={TreeView} doc={doc} />
        <Preview {...props} component={TreeView} doc={doc} sampleData={sampleData} />
        <Props {...props} component={TreeView} doc={doc} />
      </div>);
  });
