
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { DocNotice } from '../../src/components/DocNotice';

  import Header from '../base/header';
  import Props from '../base/props';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('DocNotice', module);

  stories.add('DocNotice', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={DocNotice} doc={doc} />
        <Preview {...props} component={DocNotice} doc={doc} />
        <Props {...props} component={DocNotice} doc={doc} />
      </div>);
  });
  