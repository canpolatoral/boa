/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { TreeView } from '@boa/components/TreeView';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';
import sampleData from '@boa/components/TreeView/data/sampleData';

const stories = storiesOf('TreeView', module);

stories.add('TreeView', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={TreeView} doc={doc} />
      <Preview {...props} component={TreeView} doc={doc} sampleData={sampleData} />
      <Props {...props} component={TreeView} doc={doc} />
    </div>
  );
});
