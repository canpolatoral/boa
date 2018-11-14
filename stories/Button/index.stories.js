/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '../../src/components/Button';
import Header from '../base/header';
import Props from '../base/props-table';
import Preview from '../base/preview';
import doc from './doc.json';

const stories = storiesOf('Button', module);

stories.add('Button', ({ props }) => {
  return (
    <div style={{ padding: 20, background: 'white' }}>
      <Header {...props} component={Button} doc={doc} />
      <Preview {...props} component={Button} doc={doc} />
      <Props {...props} component={Button} doc={doc} />
    </div>
  );
});
