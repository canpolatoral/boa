/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { DocNotice } from '@boa/components/DocNotice';
import Header from '../../base/header';
import Props from '../../base/props-table';
import Preview from '../../base/preview';
import doc from './doc.json';

const stories = storiesOf('Documentation', module);

stories.add('DocNotice', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white', textAlign: 'justify' }}>
      <Header {...props} component={DocNotice} doc={doc} />
      <Preview {...props} component={DocNotice} doc={doc} />
      <Props {...props} component={DocNotice} doc={doc} />
    </div>
  );
});
