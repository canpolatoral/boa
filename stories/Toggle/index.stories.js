/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Toggle } from '../../src/components/Toggle';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('Toggle', module);

stories.add('Toggle', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={Toggle} doc={doc} />
      <Preview {...props} component={Toggle} doc={doc} />
      <Props {...props} component={Toggle} doc={doc} />
    </div>
  );
});
