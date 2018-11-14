/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { DocViewer } from '../../src/components/DocViewer';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('DocViewer', module);

stories.add('DocViewer', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={DocViewer} doc={doc} />
      <Preview {...props} component={DocViewer} doc={doc} />
      <Props {...props} component={DocViewer} doc={doc} />
    </div>
  );
});
