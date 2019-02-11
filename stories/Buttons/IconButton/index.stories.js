/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IconButton } from '@boa/components/IconButton';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

const stories = storiesOf('Button', module);

stories.add('IconButton', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={IconButton} doc={doc} />
      <Preview {...props} component={IconButton} doc={doc} />
      <Props {...props} component={IconButton} doc={doc} />
    </div>
  );
});
