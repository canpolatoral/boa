
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { DocToc } from '../../src/components/DocToc';

  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';

  const doc = require('./doc.json');

  const stories = storiesOf('DocToc', module);

  stories.add('DocToc', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={DocToc} doc={doc} />
        <Preview {...props} component={DocToc} doc={doc} />
        <Props {...props} component={DocToc} doc={doc} />
      </div>);
  });
  