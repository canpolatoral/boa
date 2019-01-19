/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { TabBar } from '@boa/components/TabBar';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('TabBar', module);

stories.add('TabBar', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={TabBar} doc={doc} />
      <Preview {...props} component={TabBar} doc={doc} />
      <Props {...props} component={TabBar} doc={doc} />
    </div>
  );
});
