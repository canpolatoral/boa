/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IconMenu } from '../../src/components/IconMenu';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('IconMenu', module);

stories.add('IconMenu', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={IconMenu} doc={doc} />
      <Preview {...props} component={IconMenu} doc={doc} />
      <Props {...props} component={IconMenu} doc={doc} />
    </div>
  );
});
